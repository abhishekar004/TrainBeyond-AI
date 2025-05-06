import os
import subprocess

def install_requirements():
    """Install required npm packages"""
    print("Installing required packages...")
    subprocess.run(["npm", "install", "-g", "mdpdf"])

def generate_pdf():
    """Convert markdown to PDF"""
    input_file = "../docs/TrainBeyond_AI_Research_Paper.md"
    output_file = "../docs/TrainBeyond_AI_Research_Paper.pdf"
    
    print("Converting Markdown to PDF...")
    subprocess.run(["mdpdf", input_file, output_file])
    
    if os.path.exists(output_file):
        print(f"PDF generated successfully: {output_file}")
    else:
        print("Error generating PDF")

if __name__ == "__main__":
    install_requirements()
    generate_pdf() 