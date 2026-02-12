import requests
from bs4 import BeautifulSoup
import os

url = "https://en.wikipedia.org/wiki/University_of_Electronic_Science_and_Technology_of_China"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

output_dir = r"d:\trae project\biographical\my-video\public"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created directory: {output_dir}")

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Try to find the infobox image
    infobox = soup.find('table', class_='infobox')
    if infobox:
        img = infobox.find('img')
        if img:
            src = img.get('src')
            if src.startswith('//'):
                src = 'https:' + src
            print(f"Found thumbnail URL: {src}")
            
            # Try to construct original URL
            # From: https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/UESTC_xiaohui.png/250px-UESTC_xiaohui.png
            # To:   https://upload.wikimedia.org/wikipedia/en/6/6c/UESTC_xiaohui.png
            
            original_url = src
            if '/thumb/' in src:
                parts = src.split('/thumb/')
                base_part = parts[0] # https://upload.wikimedia.org/wikipedia/en
                rest_part = parts[1] # 6/6c/UESTC_xiaohui.png/250px-UESTC_xiaohui.png
                
                # The rest part contains the path to original file + slash + thumbnail filename
                # We need to find the last slash before the thumbnail filename
                # Actually, wikipedia structure is usually: /thumb/A/B/Filename.ext/Width-Filename.ext.png
                # So we just need to remove the last component
                
                path_parts = rest_part.split('/')
                # Remove the last part (the thumbnail filename)
                original_path = "/".join(path_parts[:-1])
                
                original_url = f"{base_part}/{original_path}"
                print(f"Constructed original URL: {original_url}")
            
            # Try downloading original, fallback to thumbnail
            download_url = original_url
            try:
                # Check if original exists (HEAD request)
                check = requests.head(original_url, headers=headers)
                if check.status_code != 200:
                    print("Original URL check failed, falling back to thumbnail")
                    download_url = src
            except:
                download_url = src

            print(f"Downloading from: {download_url}")
            img_data = requests.get(download_url, headers=headers).content
            
            # Determine extension
            ext = 'png'
            if download_url.lower().endswith('.svg'):
                ext = 'svg'
            elif download_url.lower().endswith('.jpg') or download_url.lower().endswith('.jpeg'):
                ext = 'jpg'
            elif download_url.lower().endswith('.png'):
                ext = 'png'
            
            output_path = os.path.join(output_dir, f"uestc-logo.{ext}")
            with open(output_path, 'wb') as f:
                f.write(img_data)
            print(f"Downloaded to {output_path}")
                
        else:
            print("No image found in infobox")
    else:
        print("No infobox found")

except Exception as e:
    print(f"Error: {e}")
