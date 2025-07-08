#get https cert
PS E:\workspace\20250519_Face_Profiling> .\face_profiling\.venv\Scripts\activate
(.venv) PS E:\workspace\20250519_Face_Profiling> certbot certonly --standalone -d sunchong88.asuscomm.com
certbot certonly --standalone -d sunchong88.asuscomm.com

C:\Python313\python.exe -m venv .venv

pip install -r app\requirements.txt
pip install git+https://github.com/ageitgey/face_recognition_models

Instead of running the script directly, you should run it as a module from the parent directory of app (which is e:\workspace\20250519_Face_Profiling\face_profiling in your case).

The command would be:
python -m uvicorn app.main:app --reload

This command tells Python:

-m: to load and run a module.
app.main: to look for a package named app and then run the main.py file within that package as a module.


# auxilary commands
python -m app.main

python -m app.clustering_utils  
