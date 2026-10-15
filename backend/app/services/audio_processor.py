# # app/services/audio_processor.py 
# import io
# import cv2
# import librosa
# import numpy as np
# import noisereduce as nr
# from app.config import settings

# class AudioProcessor:
#     def __init__(self):
#         self.sr = settings.SAMPLE_RATE
#         self.target_len = settings.TARGET_LENGTH
#         self.n_mels = settings.N_MELS
#         self.spec_size = settings.SPEC_IMAGE_SIZE
#         self.n_mfcc = settings.N_MFCC
#         self.fmin = settings.PITCH_FMIN
#         self.fmax = settings.PITCH_FMAX

#     def load_and_preprocess(self, file_bytes: bytes) -> tuple[np.ndarray, float]:
#         with io.BytesIO(file_bytes) as audio_buffer:
#             y, original_sr = librosa.load(audio_buffer, sr=self.sr)
        
#         orig_duration = float(len(y) / self.sr)

#         # Truncate or Pad to exactly 1.0 second
#         if len(y) > self.target_len:
#             y = y[:self.target_len]
#         else:
#             y = np.pad(y, (0, self.target_len - len(y)), mode='constant')

#         # Denoise
#         y_clean = nr.reduce_noise(y=y, sr=self.sr)
#         return y_clean, orig_duration

#     def extract_mel_spectrogram(self, y: np.ndarray) -> np.ndarray:
#         mel = librosa.feature.melspectrogram(y=y, sr=self.sr, n_mels=self.n_mels)
#         mel_db = librosa.power_to_db(mel, ref=np.max)

#         # Min-Max Normalisation
#         min_val = np.min(mel_db)
#         max_val = np.max(mel_db)
#         mel_norm = (mel_db - min_val) / (max_val - min_val + 1e-6)

#         # Resize and add channel dimension for CNN
#         mel_resized = cv2.resize(mel_norm, (self.spec_size, self.spec_size))
#         return np.expand_dims(mel_resized, axis=-1)

#     def extract_numerical_features(self, y: np.ndarray) -> tuple[np.ndarray, dict]:
#         features = []

#         # 1. MFCC (16 mean + 16 std = 32 features)
#         mfcc = librosa.feature.mfcc(y=y, sr=self.sr, n_mfcc=self.n_mfcc)
#         features.extend(np.mean(mfcc, axis=1))
#         features.extend(np.std(mfcc, axis=1))

#         # 2. Spectral Centroid (mean + std = 2 features)
#         centroid = librosa.feature.spectral_centroid(y=y, sr=self.sr)
#         features.append(float(np.mean(centroid)))
#         features.append(float(np.std(centroid)))

#         # 3. Pitch (mean + std = 2 features)
#         f0 = librosa.yin(y, fmin=self.fmin, fmax=self.fmax)
#         f0_clean = f0[~np.isnan(f0)]
#         if len(f0_clean) > 0:
#             pitch_mean = float(np.mean(f0_clean))
#             features.append(pitch_mean)
#             features.append(float(np.std(f0_clean)))
#         else:
#             pitch_mean = 0.0
#             features.extend([0.0, 0.0])

#         # Total: 36 Features
#         feature_vector = np.array(features, dtype=np.float32)
        
#         metadata = {
#             "pitch_mean_hz": pitch_mean
#         }
        
#         return feature_vector, metadata





import io
import cv2
import librosa
import numpy as np
import noisereduce as nr
from app.config import settings

class AudioProcessor:
    def __init__(self):
        self.sr = settings.SAMPLE_RATE
        self.target_len = settings.TARGET_LENGTH
        self.n_mels = settings.N_MELS
        self.spec_size = settings.SPEC_IMAGE_SIZE
        self.n_mfcc = settings.N_MFCC
        self.fmin = settings.PITCH_FMIN
        self.fmax = settings.PITCH_FMAX

    def load_and_preprocess(self, file_bytes: bytes) -> tuple[np.ndarray, float]:
        with io.BytesIO(file_bytes) as audio_buffer:
            y, original_sr = librosa.load(audio_buffer, sr=self.sr)
        
        orig_duration = float(len(y) / self.sr)
        if len(y) > self.target_len:
            y = y[:self.target_len]
        else:
            y = np.pad(y, (0, self.target_len - len(y)), mode='constant')

        y_clean = nr.reduce_noise(y=y, sr=self.sr)
        return y_clean, orig_duration

    def extract_mel_spectrogram(self, y: np.ndarray) -> np.ndarray:
        mel = librosa.feature.melspectrogram(y=y, sr=self.sr, n_mels=self.n_mels)
        mel_db = librosa.power_to_db(mel, ref=np.max)

        min_val = np.min(mel_db)
        max_val = np.max(mel_db)
        mel_norm = (mel_db - min_val) / (max_val - min_val + 1e-6)

        mel_resized = cv2.resize(mel_norm, (self.spec_size, self.spec_size))
        return np.expand_dims(mel_resized, axis=-1)

    def extract_all_features(self, y: np.ndarray) -> tuple[dict, dict]:
        """Extracts all base features into a dictionary for dynamic subsetting."""
        feature_dict = {}

        # MFCC
        mfcc = librosa.feature.mfcc(y=y, sr=self.sr, n_mfcc=self.n_mfcc)
        feature_dict["mfcc"] = np.concatenate([np.mean(mfcc, axis=1), np.std(mfcc, axis=1)])

        # Centroid
        centroid = librosa.feature.spectral_centroid(y=y, sr=self.sr)
        feature_dict["centroid"] = np.array([np.mean(centroid), np.std(centroid)])

        # RMS
        rms = librosa.feature.rms(y=y)
        feature_dict["rms"] = np.array([np.mean(rms), np.std(rms)])

        # ZCR
        zcr = librosa.feature.zero_crossing_rate(y)
        feature_dict["zcr"] = np.array([np.mean(zcr), np.std(zcr)])

        # Pitch
        f0 = librosa.yin(y, fmin=self.fmin, fmax=self.fmax)
        f0_clean = f0[~np.isnan(f0)]
        pitch_mean = float(np.mean(f0_clean)) if len(f0_clean) > 0 else 0.0
        pitch_std = float(np.std(f0_clean)) if len(f0_clean) > 0 else 0.0
        feature_dict["pitch"] = np.array([pitch_mean, pitch_std])
        
        metadata = {"pitch_mean_hz": pitch_mean}
        
        return feature_dict, metadata
