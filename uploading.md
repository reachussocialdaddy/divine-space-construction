# Technical Documentation: Photo Upload & AI Integration Process

This document outlines the current implementation of the photo upload and processing pipeline for the Divine Space platform.

## 1. Frontend File Handling (React)
Users select images through a high-fidelity custom input. The system captures the file and converts it for immediate processing.

```typescript
// Location: components/Products/InvernessPage.tsx
const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64); // UI Preview
      startScanning();          // Visual Feedback
      await analyzeImageWithAI(base64); // AI Engine Handshake
    };
    reader.readAsDataURL(file);
  }
};
```

## 2. Supabase Storage Integration
Images are uploaded to secure buckets to ensure high availability and CDN-backed delivery.

```typescript
// Supabase Asset Storage Pipeline
const uploadToSupabase = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('project-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data.path;
};
```

## 3. AI Vision Processing (Gemini Pro Vision)
The system performs a deep scan of the uploaded photo to identify architectural layers (Walls, Floors, Lighting).

```typescript
// Location: services/geminiService.ts
export const analyzeRoom = async (base64Image: string) => {
  const ai = getAIClient();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Perform architectural segmentation: Identify Walls, Floors, and Lighting coordinates.";
  
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } }
  ]);
  
  return result.response.text();
};
```

## 4. Current Status
- [x] UI/UX for File Selection
- [x] Base64 Real-time Preview
- [/] AI Layer Masking Optimization
- [ ] Final Database Synchronization

---
**Status:** In Progress
**Priority:** High
