from datetime import datetime

# Define allowed file types for dropdown selection
ALLOWED_FILE_TYPES = ["pdf", "txt", "jpg", "jpeg", "png", "gif", "doc", "docx", "ppt", "pptx", "csv", "json", "xml", "mp4", "mp3", "zip", "tar", "7z", "md", "html", "css", "js", "ts", "tsx", "jsx", "py", "java", "c", "cpp", "rb", "php", "go", "rs", "sql", "yaml", "yml", "ini", "log", "other"]

def is_valid_file_type(file_type: str) -> bool:
    return file_type.lower() in ALLOWED_FILE_TYPES

def create_resource(
    title: str,
    description: str,
    categories: list,
    uploader_id: str,
    file_type: str,
    external_link: str
) -> dict:
    return {
        "title": title,
        "description": description,
        "categories": categories,  # Required: 1 to 3 selected
        "uploader_id": uploader_id,
        "file_type": file_type,
        "external_link": external_link,  # Required link
        "file_url": None,                # File field kept for future flexibility
        "bookmarked_by": [],
        "rating": 0,
        "created_at": datetime.utcnow()
    }