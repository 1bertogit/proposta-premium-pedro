import os
import shutil
from datetime import datetime

from app import app, about, cases, methodology, services, investment, faq


def write_html(output_dir, html):
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, "index.html")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)


def render_route(path, view_func):
    with app.test_request_context(path):
        return view_func()


def main():
    # Prepare dist directory
    dist_dir = "dist"
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir, exist_ok=True)

    # Copy static assets
    if os.path.exists("static"):
        shutil.copytree("static", os.path.join(dist_dir, "static"))

    # Copy Netlify redirects into publish directory
    if os.path.exists("_redirects"):
        shutil.copy("_redirects", os.path.join(dist_dir, "_redirects"))

    # Current year for templates
    current_year = datetime.now().year

    # Render root (/) -> about
    html_root = render_route("/", about)
    write_html(dist_dir, html_root)

    # Render each page to folder/index.html so direct paths work
    pages = [
        ("/sobre", "sobre", about),
        ("/cases", "cases", cases),
        ("/metodologia", "metodologia", methodology),
        ("/servicos", "servicos", services),
        ("/investimento", "investimento", investment),
        ("/faq", "faq", faq),
    ]

    for path, folder, view in pages:
        html = render_route(path, view)
        write_html(os.path.join(dist_dir, folder), html)


if __name__ == "__main__":
    main()