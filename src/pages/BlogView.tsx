
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comments } from "@/components/Comments";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function BlogView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBlogById, likeBlog, addComment } = useBlog();
  const { user } = useAuth();
  
  const blog = getBlogById(id || "");
  
  if (!blog) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }
  
  const isLiked = user && blog.likes.includes(user.username);
  const formattedDate = format(new Date(blog.createdAt), "MMMM d, yyyy");
  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });
  
  const handleLike = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    likeBlog(blog.id);
  };
  
  const handleAddComment = (text: string) => {
    addComment(blog.id, text);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="aspect-[2/1] overflow-hidden rounded-lg mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Title and Meta */}
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={blog.author.avatar} />
            <AvatarFallback>{blog.author.displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{blog.author.displayName}</div>
            <div className="text-sm text-muted-foreground">
              {formattedDate} ({timeAgo})
            </div>
          </div>
        </div>
        
        {/* Blog Content */}
        <div 
          className="prose max-w-none mb-12 rich-text"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {/* Likes */}
        <div className="flex items-center gap-4 border-t border-b py-6 mb-8">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${isLiked ? "bg-blog-primary hover:bg-blog-primary/90" : ""}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} />
            <span>{isLiked ? "Liked" : "Like"}</span>
            <span className="text-sm">({blog.likes.length})</span>
          </Button>
        </div>
        
        {/* Comments Section */}
        <Comments comments={blog.comments} onAddComment={handleAddComment} />
      </div>
    </div>
  );
}
