
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import { useToast } from "@/components/ui/use-toast";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="container py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold font-heading mb-6">Write a New Blog</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title"
                className="text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="max-w-md"
                />
              </div>
              {coverImage && (
                <div className="mt-2">
                  <div className="relative aspect-video max-w-md overflow-hidden rounded-md">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setCoverImage(undefined)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                onImageUpload={handleImageUpload}
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? "Publishing..." : "Publish Blog"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
