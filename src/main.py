import argparse
import os
import qrcode
from PIL import Image

DEFAULT_LOGO_PATH = os.path.join(os.path.dirname(__file__), "..", "static", "ASBTEC.jpg")
LOGO_SCALE = 0.3  # logo occupies 30% of the QR code width/height

def main():
    parser = argparse.ArgumentParser(description="Generate a QR code with an optional centre logo.")
    parser.add_argument("url", help="URL to encode in the QR")
    parser.add_argument("--logo", default=None, help="Path to logo image (defaults to static/ASBTEC.jpg)")
    args = parser.parse_args()

    logo_path = args.logo if args.logo else DEFAULT_LOGO_PATH

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(args.url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    # Overlay the logo in the centre
    logo = Image.open(logo_path).convert("RGBA")
    qr_w, qr_h = img.size
    logo_size = int(min(qr_w, qr_h) * LOGO_SCALE)
    logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
    pos = ((qr_w - logo_size) // 2, (qr_h - logo_size) // 2)
    img.paste(logo, pos, mask=logo)

    filename = "qr.png"
    img.save(filename)
    print(f"QR code saved to '{filename}' for URL: {args.url}")

if __name__ == "__main__":
    main()
