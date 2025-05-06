"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useFormContext } from "react-hook-form"

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void
  className?: string
  buttonText?: string
  acceptedFileTypes?: string
  maxSizeMB?: number
  name?: string // Add field name for form integration
}

// Helper function to generate initials from a name
function getInitials(name?: string): string {
  if (!name) return "Add image";
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to first two initials
}

export function ImageUpload({
  onUploadComplete,
  className = "",
  buttonText = "Upload Image",
  acceptedFileTypes = "image/jpeg, image/png, image/jpg",
  maxSizeMB = 5,
  name,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>('https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?ga=GA1.1.1514780181.1745920449&semt=ais_hybrid&w=740')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Safely check if we're in a form context
  const formContext = (() => {
    try {
      return useFormContext();
    } catch (e) {
      return null;
    }
  })();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) { toast.error("Please select a file");
        return 
      }

    // Validate file type
    if (!file.type.match(acceptedFileTypes.replace(/\s/g, "").split(",").join("|"))) {
      toast.error("Invalid file type. Please select an image file.")
      return
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit.`)
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      
      // If we have a form context and a field name, update the form value
      if (formContext && name) {
        formContext.setValue(name, result);
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      // Call the API endpoint
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      toast.success("Image uploaded successfully!")
      
      // Call the callback with the image URL
      if (onUploadComplete) {
        onUploadComplete(data.imageUrl)
      }
      
      // If we have a form context and a field name, update the form value
      if (formContext && name) {
        formContext.setValue(name, data.imageUrl);
      }
      
      // Reset the component state
      setSelectedFile(null)
      setPreviewUrl('https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?ga=GA1.1.1514780181.1745920449&semt=ais_hybrid&w=740')
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-64 h-64 overflow-hidden rounded-md border border-gray-200">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-bold text-4xl">
              {getInitials(name)}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={acceptedFileTypes}
            className="hidden"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            Select File
          </Button>
          
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : buttonText}
          </Button>
        </div>
        
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
          </p>
        )}
      </div>
    </div>
  )
}