import os
import time
import requests

API_URL = "https://cry-analyzer.onrender.com/api/v1/predict"

FILE_PATH = (
    r"D:\Projects\NEONATAL\notebook\dataset\sepsis"
    r"\PA_HIE(III)_Sepsis_220915_1559_expiration1.wav"
)


def main():
    if not os.path.isfile(FILE_PATH):
        print(f"ERROR: Audio file not found:\n{FILE_PATH}")
        return

    print("Sending audio to the Render API...")
    print("Please wait for the response.\n")

    start_time = time.time()

    try:
        with open(FILE_PATH, "rb") as audio:
            response = requests.post(
                API_URL,
                files={
                    "file": (
                        os.path.basename(FILE_PATH),
                        audio,
                        "audio/wav",
                    )
                },
                timeout=(20, 180),
            )

        elapsed = time.time() - start_time

        print(f"HTTP Status: {response.status_code}")
        print(f"Time Taken: {elapsed:.2f} seconds")
        print("\nResponse:")
        print(response.text[:5000])

    except requests.exceptions.Timeout as exc:
        print(f"REQUEST TIMED OUT: {exc}")

    except requests.exceptions.RequestException as exc:
        print(f"REQUEST FAILED: {type(exc).__name__}: {exc}")

    except OSError as exc:
        print(f"FILE ERROR: {exc}")


if __name__ == "__main__":
    main()