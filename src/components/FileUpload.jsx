import { useState, useRef, useCallback } from 'react'
import clsx from 'clsx'

const FileUpload = ({ 
  onFileSelect, 
  onFileRemove,
  accept = "*", 
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  showThumbnails = true,
  className = '',
  disabled = false,
  label = 'Upload files',
  description = 'Click to upload or drag and drop',
  error = null
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    const type = file.type.split('/')[0]
    switch (type) {
      case 'image':
        return '🖼️'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'application':
        if (file.type.includes('pdf')) return '📄'
        if (file.type.includes('word') || file.type.includes('document')) return '📝'
        if (file.type.includes('sheet') || file.type.includes('excel')) return '📊'
        return '📄'
      default:
        return '📁'
    }
  }

  const createThumbnail = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  }

  const validateFiles = (fileList) => {
    const newErrors = []
    const fileArray = Array.from(fileList)

    if (!multiple && fileArray.length > 1) {
      newErrors.push('Only one file is allowed')
      return { valid: false, errors: newErrors }
    }

    if (fileArray.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`)
      return { valid: false, errors: newErrors }
    }

    for (const file of fileArray) {
      if (file.size > maxSize) {
        newErrors.push(`${file.name} is too large (max ${formatFileSize(maxSize)})`)
      }
    }

    return { valid: newErrors.length === 0, errors: newErrors }
  }

  const handleFiles = useCallback(async (fileList) => {
    const validation = validateFiles(fileList)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setErrors([])
    const fileArray = Array.from(fileList)
    const filesWithThumbnails = await Promise.all(
      fileArray.map(async (file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        thumbnail: await createThumbnail(file),
        size: formatFileSize(file.size),
        type: file.type,
        name: file.name
      }))
    )

    const newFiles = multiple ? [...files, ...filesWithThumbnails] : filesWithThumbnails
    setFiles(newFiles)
    
    if (onFileSelect) {
      const fileObjects = newFiles.map(f => f.file)
      onFileSelect(multiple ? fileObjects : fileObjects[0])
    }
  }, [files, multiple, maxFiles, maxSize, onFileSelect])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (disabled) return
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleRemove = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    
    if (onFileRemove) {
      onFileRemove(fileId)
    }
    
    if (onFileSelect) {
      const fileObjects = updatedFiles.map(f => f.file)
      onFileSelect(multiple ? fileObjects : fileObjects[0])
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      {/* Upload Area */}
      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragActive && !disabled
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300 bg-red-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <div className="space-y-2">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <span className={clsx(
              'font-medium',
              !disabled ? 'text-primary-600 hover:text-primary-500' : 'text-gray-400'
            )}>
              {label}
            </span>
            {' '}or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {accept === "*" ? "Any file type" : accept}
            {maxSize && ` (max ${formatFileSize(maxSize)})`}
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File Thumbnails */}
      {showThumbnails && files.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start space-x-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {fileData.thumbnail ? (
                      <img
                        src={fileData.thumbnail}
                        alt={fileData.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-2xl">
                        {getFileIcon(fileData.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileData.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileData.size}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fileData.type}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(fileData.id)
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    aria-label={`Remove ${fileData.name}`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List (Simple) */}
      {!showThumbnails && files.length > 0 && (
        <div className="mt-4">
          <div className="space-y-2">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(fileData.file)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fileData.name}</p>
                    <p className="text-xs text-gray-500">{fileData.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(fileData.id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label={`Remove ${fileData.name}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload

