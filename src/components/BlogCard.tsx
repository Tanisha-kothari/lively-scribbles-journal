
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blog } from "@/contexts/BlogContext";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  blog: Blog;
  onLike?: (id: string) => void;
  isLiked?: boolean;
  showInteractions?: boolean;
}

export function BlogCard({ blog, onLike, isLiked = false, showInteractions = true }: BlogCardProps) {
  const truncateContent = (content: string, maxLength = 150) => {
    // Remove HTML tags and truncate
    const strippedContent = content.replace(/<[^>]*>?/gm, '');
    if (strippedContent.length <= maxLength) return strippedContent;
    return `${strippedContent.substring(0, maxLength)}...`;
  };

  const formattedDate = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 animate-fade-in">
      {blog.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={blog.author.avatar} />
            <AvatarFallback>{blog.author.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            {blog.author.displayName} • {formattedDate}
          </div>
        </div>
        <Link to={`/blog/${blog.id}`}>
          <h3 className="text-xl font-semibold font-heading mb-2 hover:text-blog-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-3 mb-3">
          {truncateContent(blog.content)}
        </p>
        <Link to={`/blog/${blog.id}`} className="text-blog-primary font-medium hover:underline">
          Read more
        </Link>
      </CardContent>
      {showInteractions && (
        <CardFooter className="flex justify-between p-4 pt-0 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
              onClick={() => onLike && onLike(blog.id)}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
              <span>{blog.likes.length}</span>
            </Button>
            <Link to={`/blog/${blog.id}#comments`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{blog.comments.length}</span>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
