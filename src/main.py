import os
import qrcode
import sys
from PIL import Image

LOGO_PATH = os.path.join(os.path.dirname(__file__), "..", "static", "ASBTEC.jpg")
LOGO_SCALE = 0.3  # logo occupies 30% of the QR code width/height

def main():
    if len(sys.argv) != 2:
        print("Usage: python main.py <url>")
        sys.exit(1)

    # len(sys.argv) == 2
    url = sys.argv[1]

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    # Overlay the logo in the centre
    logo = Image.open(LOGO_PATH).convert("RGBA")
    qr_w, qr_h = img.size
    logo_size = int(min(qr_w, qr_h) * LOGO_SCALE)
    logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
    pos = ((qr_w - logo_size) // 2, (qr_h - logo_size) // 2)
    img.paste(logo, pos, mask=logo)

    filename = "qr.png"
    img.save(filename)
    print(f"QR code saved to '{filename}' for URL: {url}")

if __name__ == "__main__":
    main()
