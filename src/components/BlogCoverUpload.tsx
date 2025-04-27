
import React from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface BlogCoverUploadProps {
  coverImage?: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function BlogCoverUpload({ coverImage, onImageUpload, onRemoveImage }: BlogCoverUploadProps) {
  return (
    <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-muted/30 border-2 border-dashed border-muted-foreground/25">
      {coverImage ? (
        <>
          <img
            src={coverImage}
            alt="Cover preview"
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <Button 
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 shadow-lg"
            onClick={onRemoveImage}
          >
            Remove Cover
          </Button>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Image className="w-8 h-8" />
          <div className="text-sm font-medium">Click to upload cover image</div>
          <div className="text-xs">Recommended: 1920×1080 or higher</div>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}
