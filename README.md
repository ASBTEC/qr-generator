# qr-generator
Simple script to generate qr images from URLs.

## Prerequisites
* Python3 installed in your system.
* Python3 virtual environment with prerequsites.
* Access to filesystem to store the created QR as PNG image.


```shell
cd qr-generator
sudo apt install -y python3
rm -rf ./venv
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
```

## Usage
```shell
./venv/bin/python3 src/main.py https://example.com/

```

