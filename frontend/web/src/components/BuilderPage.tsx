import React from "react";
import { Content, fetchOneEntry, isPreviewing } from "@builder.io/sdk-react";

interface BuilderPageProps {
  model?: string;
  content?: any;
}

// Your Builder.io API key - set this in your environment variables
const BUILDER_PUBLIC_API_KEY =
  import.meta.env.VITE_BUILDER_API_KEY || "your-api-key-here";

export const BuilderPage: React.FC<BuilderPageProps> = ({
  model = "page",
  content,
}) => {
  // This would be used in a more complex setup with routing
  if (!content && !isPreviewing()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Builder.io Content Not Found
          </h1>
          <p className="text-gray-600">
            Make sure you have published content at builder.io and set your API
            key.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Content
        content={content}
        apiKey={BUILDER_PUBLIC_API_KEY}
        model={model}
      />
    </div>
  );
};

export default BuilderPage;
