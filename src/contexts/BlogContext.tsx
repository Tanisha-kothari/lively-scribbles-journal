
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
  likes: string[]; // Array of usernames who liked
  comments: Comment[];
  coverImage?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: {
    username: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
}

interface BlogContextType {
  blogs: Blog[];
  addBlog: (title: string, content: string, coverImage?: string) => void;
  likeBlog: (blogId: string) => void;
  addComment: (blogId: string, comment: string) => void;
  getUserBlogs: (username: string) => Blog[];
  getBlogById: (id: string) => Blog | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Sample blogs for demo
const SAMPLE_BLOGS = [
  {
    id: "1",
    title: "Getting Started with React",
    content: "<h1>React Basics</h1><p>React is a JavaScript library for building user interfaces. It's maintained by Facebook and a community of individual developers and companies.</p><p>React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with rendering data to the DOM, and so creating React applications usually requires the use of additional libraries for state management, routing, and interaction with an API.</p><h2>Why React?</h2><p>React's primary feature is its component-based architecture which allows for reusable UI components that manage their own state. This makes it easier to build and maintain complex UIs.</p><p>React's virtual DOM implementation and other optimizations provide a very efficient update and rendering mechanism.</p>",
    author: {
      username: "user",
      displayName: "Demo User",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user",
    },
    createdAt: "2025-04-25T10:00:00Z",
    likes: [],
    comments: [
      {
        id: "c1",
        text: "Great introduction to React! Looking forward to more articles.",
        author: {
          username: "user",
          displayName: "Demo User",
          avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user",
        },
        createdAt: "2025-04-26T08:30:00Z",
      },
    ],
    coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Advanced CSS Techniques",
    content: "<h1>Modern CSS Techniques</h1><p>CSS has come a long way from its early days. With modern CSS, we can create complex layouts, animations, and effects that previously required JavaScript.</p><h2>CSS Grid Layout</h2><p>CSS Grid Layout is a two-dimensional grid-based layout system aimed at web design. It allows for the creation of complex responsive web design layouts more easily and consistently across browsers.</p><h2>CSS Flexbox</h2><p>Flexbox is a one-dimensional layout method for laying out items in rows or columns. Items flex to fill additional space and shrink to fit into smaller spaces.</p><p>Modern websites often combine Grid for the overall layout and Flexbox for components and smaller elements.</p>",
    author: {
      username: "user",
      displayName: "Demo User",
      avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user",
    },
    createdAt: "2025-04-24T15:30:00Z",
    likes: [],
    comments: [],
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop",
  },
];

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Initialize blogs from localStorage or use sample blogs
    const storedBlogs = localStorage.getItem("blogPosts");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      setBlogs(SAMPLE_BLOGS);
      localStorage.setItem("blogPosts", JSON.stringify(SAMPLE_BLOGS));
    }
  }, []);

  const addBlog = (title: string, content: string, coverImage?: string) => {
    if (!user) return;

    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      content,
      author: {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      coverImage,
    };

    setBlogs(prev => {
      const updatedBlogs = [newBlog, ...prev];
      localStorage.setItem("blogPosts", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };

  const likeBlog = (blogId: string) => {
    if (!user) return;

    setBlogs(prev => {
      const updatedBlogs = prev.map(blog => {
        if (blog.id === blogId) {
          const userLiked = blog.likes.includes(user.username);
          return {
            ...blog,
            likes: userLiked
              ? blog.likes.filter(username => username !== user.username)
              : [...blog.likes, user.username],
          };
        }
        return blog;
      });

      localStorage.setItem("blogPosts", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };

  const addComment = (blogId: string, text: string) => {
    if (!user || !text) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author: {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      createdAt: new Date().toISOString(),
    };

    setBlogs(prev => {
      const updatedBlogs = prev.map(blog => {
        if (blog.id === blogId) {
          return {
            ...blog,
            comments: [...blog.comments, newComment],
          };
        }
        return blog;
      });

      localStorage.setItem("blogPosts", JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };

  const getUserBlogs = (username: string) => {
    return blogs.filter(blog => blog.author.username === username);
  };

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        addBlog,
        likeBlog,
        addComment,
        getUserBlogs,
        getBlogById,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
