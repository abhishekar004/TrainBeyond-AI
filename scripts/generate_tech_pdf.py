import markdown
import pdfkit
import os

def markdown_to_html():
    """Convert markdown to HTML"""
    print("Converting Markdown to HTML...")
    
    # Read markdown content
    with open("../docs/Technical_Stack.md", "r", encoding="utf-8") as f:
        markdown_content = f.read()
    
    # Convert to HTML
    html_content = markdown.markdown(
        markdown_content,
        extensions=['fenced_code', 'tables', 'toc']
    )
    
    # Add CSS for styling
    styled_html = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 40px;
            }}
            code {{
                background-color: #f4f4f4;
                padding: 2px 5px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
            }}
            pre {{
                background-color: #f4f4f4;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
            }}
            h1, h2, h3 {{
                color: #2c3e50;
            }}
            h1 {{
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }}
            table {{
                border-collapse: collapse;
                width: 100%;
                margin: 15px 0;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #f8f9fa;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Save HTML file
    with open("../docs/technical_stack.html", "w", encoding="utf-8") as f:
        f.write(styled_html)
    
    return "../docs/technical_stack.html"

def html_to_pdf(html_file):
    """Convert HTML to PDF"""
    print("Converting HTML to PDF...")
    
    output_file = "../docs/TrainBeyond_AI_Technical_Stack.pdf"
    
    # Configure PDF options
    options = {
        'page-size': 'A4',
        'margin-top': '20mm',
        'margin-right': '20mm',
        'margin-bottom': '20mm',
        'margin-left': '20mm',
        'encoding': "UTF-8",
        'custom-header': [
            ('Accept-Encoding', 'gzip')
        ],
        'no-outline': None,
        'enable-local-file-access': None
    }
    
    # Convert HTML to PDF
    pdfkit.from_file(html_file, output_file, options=options)
    
    # Clean up HTML file
    os.remove(html_file)
    
    print(f"PDF generated successfully: {output_file}")

if __name__ == "__main__":
    html_file = markdown_to_html()
    html_to_pdf(html_file) 