import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { BlogCoverUpload } from "@/components/BlogCoverUpload";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Save } from "lucide-react";

export default function WriteBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addBlog } = useBlog();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    setTitle("");
    setContent("");
    setCoverImage(undefined);
  }, [isAuthenticated, navigate]);

  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleImageUpload(file);
        setCoverImage(imageUrl);
      } catch (error) {
        console.error("Cover image upload failed", error);
        toast({
          variant: "destructive",
          title: "Image upload failed",
          description: "Failed to upload cover image. Please try again.",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both title and content for your blog.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addBlog(title, content, coverImage);
      
      toast({
        title: "Blog published",
        description: "Your blog has been successfully published!",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast({
        variant: "destructive",
        title: "Failed to publish",
        description: "An error occurred while publishing your blog.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-heading tracking-tight">Create Your Story</h1>
          <p className="text-muted-foreground">Share your thoughts with the world</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Draft
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-8">
          <div>
            <BlogCoverUpload
              coverImage={coverImage}
              onImageUpload={handleCoverImageUpload}
              onRemoveImage={() => setCoverImage(undefined)}
            />
          </div>

          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="border-none bg-transparent px-0 text-4xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0"
              dir="ltr"
            />
          </div>

          <div className="prose prose-lg prose-stone dark:prose-invert">
            <RichTextEditor
              value={content}
              onChange={setContent}
              onImageUpload={handleImageUpload}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
