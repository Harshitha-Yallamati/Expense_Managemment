# Reusable UI Components Documentation

This document provides comprehensive documentation for all reusable UI components built with TailwindCSS and React.

## 📋 **Table Component (`Table.jsx`)**

A comprehensive table component with sorting, pagination, and accessibility features.

### **Props:**
- `data` (array) - Array of data objects to display
- `columns` (array) - Column configuration with `key`, `header`, `render`, `sortable`, `className`
- `onRowClick` (function) - Callback when a row is clicked
- `sortable` (boolean) - Enable column sorting
- `onSort` (function) - Callback when sorting changes
- `pagination` (boolean) - Enable pagination
- `pageSize` (number) - Items per page (default: 10)
- `onPageChange` (function) - Callback when page changes
- `currentPage` (number) - Current page number
- `totalItems` (number) - Total number of items
- `loading` (boolean) - Show loading state
- `emptyMessage` (string) - Message when no data
- `striped` (boolean) - Alternate row colors
- `hover` (boolean) - Row hover effects

### **Usage:**
```jsx
import Table from './components/Table'

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (value) => <Badge>{value}</Badge> },
  { key: 'actions', header: 'Actions', render: (_, row) => <ActionButtons row={row} /> }
]

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
]

<Table
  data={data}
  columns={columns}
  pagination={true}
  pageSize={10}
  onRowClick={(row) => console.log('Clicked:', row)}
  onSort={(field, direction) => console.log('Sort:', field, direction)}
/>
```

## 🪟 **Modal Component (`Modal.jsx`)**

A flexible modal component with header, body, and footer slots using Headless UI.

### **Props:**
- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close callback
- `title` (string) - Modal title
- `size` (string) - Size: 'sm', 'md', 'lg', 'xl', '2xl', 'full'
- `showCloseButton` (boolean) - Show close button
- `closeOnOverlayClick` (boolean) - Close on overlay click
- `header` (element) - Custom header content
- `body` (element) - Custom body content
- `footer` (element) - Custom footer content

### **Usage:**
```jsx
import Modal from './components/Modal'

// Simple usage
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
</Modal>

// Advanced usage with slots
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="lg"
  header={
    <div className="flex items-center space-x-2">
      <h3 className="text-lg font-semibold">Custom Header</h3>
    </div>
  }
  body={<div>Custom body content</div>}
  footer={
    <div className="flex justify-end space-x-2">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </div>
  }
/>

// Using sub-components
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>
    <h3 className="text-lg font-semibold">Modal Title</h3>
  </Modal.Header>
  <Modal.Body>
    <p>Modal content goes here</p>
  </Modal.Body>
  <Modal.Footer>
    <button className="btn-primary">Save</button>
  </Modal.Footer>
</Modal>
```

## 📁 **FileUpload Component (`FileUpload.jsx`)**

A comprehensive file upload component with drag-and-drop, thumbnails, and validation.

### **Props:**
- `onFileSelect` (function) - Callback when files are selected
- `onFileRemove` (function) - Callback when files are removed
- `accept` (string) - Accepted file types (default: "*")
- `multiple` (boolean) - Allow multiple files
- `maxFiles` (number) - Maximum number of files (default: 10)
- `maxSize` (number) - Maximum file size in bytes (default: 10MB)
- `showThumbnails` (boolean) - Show file thumbnails
- `disabled` (boolean) - Disable upload
- `label` (string) - Upload label
- `error` (string) - Error message

### **Usage:**
```jsx
import FileUpload from './components/FileUpload'

// Basic usage
<FileUpload
  onFileSelect={(files) => console.log('Files:', files)}
  accept="image/*"
  multiple={true}
/>

// Advanced usage
<FileUpload
  onFileSelect={(files) => setSelectedFiles(files)}
  onFileRemove={(fileId) => removeFile(fileId)}
  accept=".pdf,.doc,.docx"
  multiple={false}
  maxFiles={5}
  maxSize={5 * 1024 * 1024} // 5MB
  showThumbnails={true}
  label="Upload Documents"
  error={uploadError}
/>
```

## 📝 **FormInput Component (`FormInput.jsx`)**

A flexible form input component with validation and accessibility features.

### **Props:**
- `label` (string) - Input label
- `name` (string) - Input name
- `type` (string) - Input type (default: 'text')
- `placeholder` (string) - Placeholder text
- `value` (string) - Input value
- `onChange` (function) - Change handler
- `onBlur` (function) - Blur handler
- `error` (string) - Error message
- `helperText` (string) - Helper text
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `readOnly` (boolean) - Read-only state
- `size` (string) - Size: 'sm', 'md', 'lg'
- `icon` (element) - Icon element
- `iconPosition` (string) - Icon position: 'left', 'right'
- `showCharacterCount` (boolean) - Show character count
- `maxLength` (number) - Maximum length

### **Usage:**
```jsx
import FormInput from './components/FormInput'

// Basic usage
<FormInput
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>

// With icon
<FormInput
  label="Search"
  name="search"
  type="text"
  placeholder="Search..."
  icon={<SearchIcon />}
  iconPosition="left"
/>

// With character count
<FormInput
  label="Description"
  name="description"
  type="textarea"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  maxLength={500}
  showCharacterCount={true}
  helperText="Enter a detailed description"
/>
```

## 🔽 **Select Component (`Select.jsx`)**

A comprehensive select component with multiple selection, search, and validation.

### **Props:**
- `label` (string) - Select label
- `name` (string) - Select name
- `value` (string|array) - Selected value(s)
- `onChange` (function) - Change handler
- `options` (array) - Options array
- `placeholder` (string) - Placeholder text
- `error` (string) - Error message
- `helperText` (string) - Helper text
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `multiple` (boolean) - Multiple selection
- `clearable` (boolean) - Show clear button
- `loading` (boolean) - Loading state
- `emptyMessage` (string) - Empty state message

### **Usage:**
```jsx
import Select from './components/Select'

// Basic usage
<Select
  label="Role"
  name="role"
  value={role}
  onChange={setRole}
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'guest', label: 'Guest' }
  ]}
  placeholder="Select a role"
/>

// Multiple selection
<Select
  label="Skills"
  name="skills"
  value={skills}
  onChange={setSkills}
  multiple={true}
  options={skillOptions}
  placeholder="Select skills"
/>

// With simple string options
<Select
  label="Country"
  name="country"
  value={country}
  onChange={setCountry}
  options={['USA', 'Canada', 'Mexico', 'UK']}
  clearable={true}
/>
```

## 🎨 **Styling and Theming**

All components use TailwindCSS classes and support custom styling:

### **Custom Classes:**
```jsx
// Add custom classes
<Table className="my-custom-table" />
<Modal className="custom-modal" />
<FormInput inputClassName="custom-input" />
```

### **Size Variants:**
```jsx
// Different sizes
<FormInput size="sm" />   // Small
<FormInput size="md" />   // Medium (default)
<FormInput size="lg" />   // Large
```

## ♿ **Accessibility Features**

All components include comprehensive accessibility features:

- **ARIA attributes** for screen readers
- **Keyboard navigation** support
- **Focus management** with proper focus rings
- **Semantic HTML** structure
- **Error announcements** for form validation
- **Role attributes** for interactive elements

## 🔧 **Common Patterns**

### **Form with Validation:**
```jsx
const [formData, setFormData] = useState({})
const [errors, setErrors] = useState({})

const handleSubmit = (e) => {
  e.preventDefault()
  // Validation logic
  if (isValid) {
    // Submit form
  }
}

<form onSubmit={handleSubmit}>
  <FormInput
    label="Name"
    name="name"
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
    error={errors.name}
    required
  />
  <button type="submit" className="btn-primary">Submit</button>
</form>
```

### **Data Table with Actions:**
```jsx
const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { 
    key: 'actions', 
    header: 'Actions',
    render: (_, row) => (
      <div className="flex space-x-2">
        <button onClick={() => editUser(row)}>Edit</button>
        <button onClick={() => deleteUser(row)}>Delete</button>
      </div>
    )
  }
]

<Table
  data={users}
  columns={columns}
  pagination={true}
  onRowClick={(row) => viewUser(row)}
/>
```

## 📱 **Responsive Design**

All components are fully responsive and work on:
- **Desktop** - Full functionality
- **Tablet** - Optimized layouts
- **Mobile** - Touch-friendly interfaces

## 🚀 **Performance Tips**

- Use `React.memo()` for expensive components
- Implement proper `key` props for lists
- Use `useCallback()` for event handlers
- Avoid inline object/function creation in props

## 🧪 **Testing**

Components are designed to be easily testable:
- Clear prop interfaces
- Predictable behavior
- Accessibility attributes for testing tools
- Consistent naming conventions

## 📚 **Examples**

See the component files for detailed examples and usage patterns. Each component includes comprehensive prop documentation and usage examples.
