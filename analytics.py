import sys
import json

def log_analytics():
    # Node.js-ல் இருந்து அனுப்பப்படும் டேட்டாவை எடுக்கும்
    input_data = sys.stdin.read()
    if input_data:
        user_info = json.loads(input_data)
        print(f"[Python Analytics] Alert: New access attempt by {user_info.get('email')}")

if __name__ == "__main__":
    log_analytics()
