import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ImageIcon,
  Calendar,
  Eye,
  Plus,
  X,
  ArrowLeft,
  RefreshCw,
  Clock,
  LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Trash2,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRightClose,
  Moon,
  Sun,
} from "lucide-react";
import { uploadImage } from "../../components/utils/cloudinary";
import { showToast } from "../../components/utils/toast";

// Import a date picker component
// We'll use shadcn components
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// Mock API functions - replace with actual API calls
const saveBlogPost = async (data) => {
  console.log("Saving blog post:", data);
  return { success: true, id: data.id || "new-post-id" };
};

const getBlogPost = async (id) => {
  console.log("Fetching blog post:", id);
  if (id === "new") return null;
  // Mock data
  return {
    id,
    title: "How to Build an Effective Skincare Routine",
    subtitle: "A step-by-step guide for beginners",
    content:
      "<p>Building an effective skincare routine is essential for maintaining healthy skin. This guide will help beginners understand the basics...</p><h2>Understanding Your Skin Type</h2><p>Before you start any skincare routine, it's important to understand your skin type. Skin types can be classified as normal, dry, oily, combination, or sensitive...</p><h2>Basic Steps for Any Skincare Routine</h2><ol><li><strong>Cleansing</strong> - Washing your face is the most basic and essential step of any routine...</li><li><strong>Toning</strong> - Toners can help balance the pH of your skin and remove any remaining impurities...</li><li><strong>Moisturizing</strong> - All skin types need hydration...</li></ol><p>Remember, consistency is key to seeing results with any skincare routine. It typically takes at least 4-6 weeks to notice significant changes in your skin.</p>",
    featured_image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category_id: "skincare-basics",
    tags: ["beginners", "routine", "skin-health"],
    seo_title: "Complete Skincare Routine Guide for Beginners | Your Brand",
    seo_description:
      "Learn how to build an effective skincare routine tailored to your skin type. Step-by-step guide perfect for beginners.",
    seo_keywords:
      "skincare routine, beginners skincare, skin health, cleansing, toning, moisturizing",
    author_id: "jane-doe",
    status: "published",
    published_at: "2023-06-15T10:30:00Z",
    created_at: "2023-06-01T14:22:00Z",
    updated_at: "2023-06-14T09:15:00Z",
    reading_time: 8,
    is_featured: true,
  };
};

const getCategories = async () => {
  return [
    { id: "skincare-basics", name: "Skincare Basics" },
    { id: "acne-treatment", name: "Acne Treatment" },
    { id: "anti-aging", name: "Anti-Aging" },
    { id: "product-reviews", name: "Product Reviews" },
    { id: "skin-science", name: "Skin Science" },
    { id: "natural-remedies", name: "Natural Remedies" },
    { id: "seasonal-care", name: "Seasonal Skincare" },
  ];
};

const getAuthors = async () => {
  return [
    {
      id: "jane-doe",
      name: "Dr. Jane Doe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "john-smith",
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "sarah-lee",
      name: "Sarah Lee",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];
};

// Rich text editor commands
const formatCommands = {
  h1: () => document.execCommand("formatBlock", false, "h1"),
  h2: () => document.execCommand("formatBlock", false, "h2"),
  h3: () => document.execCommand("formatBlock", false, "h3"),
  p: () => document.execCommand("formatBlock", false, "p"),
  bold: () => document.execCommand("bold", false, null),
  italic: () => document.execCommand("italic", false, null),
  underline: () => document.execCommand("underline", false, null),
  strike: () => document.execCommand("strikeThrough", false, null),
  ul: () => document.execCommand("insertUnorderedList", false, null),
  ol: () => document.execCommand("insertOrderedList", false, null),
  indent: () => document.execCommand("indent", false, null),
  outdent: () => document.execCommand("outdent", false, null),
  alignLeft: () => document.execCommand("justifyLeft", false, null),
  alignCenter: () => document.execCommand("justifyCenter", false, null),
  alignRight: () => document.execCommand("justifyRight", false, null),
  quote: () => document.execCommand("formatBlock", false, "blockquote"),
  removeFormat: () => document.execCommand("removeFormat", false, null),
  link: (url) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const href = url || prompt("Enter link URL");
      if (href) {
        document.execCommand("createLink", false, href);
      }
    }
  },
};

// Format the date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Calculate reading time based on content length
const calculateReadingTime = (content) => {
  if (!content) return 1;
  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);
  return minutes || 1;
};

const BlogManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blogId = id || "new";
  const isNewBlog = blogId === "new";

  const editorRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    subtitle: "",
    content: "",
    featured_image: "",
    category_id: "",
    tags: [],
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    author_id: "",
    status: "draft",
    published_at: null,
    reading_time: 1,
    is_featured: false,
  });

  // Load blog post data if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories and authors
        const categoriesData = await getCategories();
        const authorsData = await getAuthors();

        setCategories(categoriesData);
        setAuthors(authorsData);

        // If it's not a new blog, load the blog data
        if (!isNewBlog) {
          const blogData = await getBlogPost(blogId);
          if (blogData) {
            setFormData(blogData);

            // Set the editor content
            if (editorRef.current && blogData.content) {
              editorRef.current.innerHTML = blogData.content;
            }

            setLastSaved(new Date(blogData.updated_at));
          }
        } else if (authorsData.length > 0) {
          // For new blogs, set the first author as default
          setFormData((prev) => ({
            ...prev,
            author_id: authorsData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error loading blog data:", error);
        showToast("error", "Failed to load blog data");
      }
    };

    loadData();

    // Set up autosave
    if (autoSaveEnabled) {
      autoSaveTimerRef.current = setInterval(() => {
        if (unsavedChanges) {
          handleAutoSave();
        }
      }, 30000); // Autosave every 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [blogId, isNewBlog, autoSaveEnabled, unsavedChanges]);

  // Update SEO title when main title changes if SEO title is empty
  useEffect(() => {
    if (formData.title && !formData.seo_title) {
      setFormData((prev) => ({
        ...prev,
        seo_title: formData.title,
      }));
    }
  }, [formData.title, formData.seo_title]);

  // Handle editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setFormData((prev) => ({
        ...prev,
        content,
        reading_time: calculateReadingTime(content),
      }));
      setUnsavedChanges(true);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setUnsavedChanges(true);
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setUnsavedChanges(true);
  };

  // Handle date changes
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      published_at: date ? date.toISOString() : null,
    }));
    setUnsavedChanges(true);
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag("");
      setUnsavedChanges(true);
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    setUnsavedChanges(true);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedUrl = await uploadImage(files[0]);
      setFormData((prev) => ({
        ...prev,
        featured_image: uploadedUrl,
      }));
      setUnsavedChanges(true);
      showToast("success", "Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("error", "Failed to upload image");
    }
  };

  // Handle insert image into editor
  const handleInsertImage = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedUrl = await uploadImage(files[0]);

      // Insert image at cursor position
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const img = document.createElement("img");
          img.src = uploadedUrl;
          img.alt = "Blog image";
          img.style.maxWidth = "100%";
          img.className = "my-4 rounded-lg";

          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);

          // Trigger editor change
          handleEditorChange();
        }
      }

      showToast("success", "Image inserted successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("error", "Failed to upload image");
    }
  };

  // Handle auto-save
  const handleAutoSave = async () => {
    if (!formData.title) return;

    try {
      const result = await saveBlogPost(formData);
      if (result.success) {
        setUnsavedChanges(false);
        setLastSaved(new Date());

        // Update ID if it's a new blog
        if (isNewBlog && result.id) {
          setFormData((prev) => ({ ...prev, id: result.id }));
          // Update URL without reloading
          window.history.replaceState(null, "", `/admin/blog/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Error auto-saving:", error);
    }
  };

  // Handle manual save
  const handleSave = async (newStatus = null) => {
    if (!formData.title) {
      showToast("error", "Blog title is required");
      return;
    }

    setIsSaving(true);

    try {
      // Update status if provided
      const dataToSave = {
        ...formData,
        status: newStatus || formData.status,
      };

      // If publishing, set published_at if not already set
      if (newStatus === "published" && !dataToSave.published_at) {
        dataToSave.published_at = new Date().toISOString();
      }

      const result = await saveBlogPost(dataToSave);

      if (result.success) {
        setUnsavedChanges(false);
        setLastSaved(new Date());
        setFormData((prev) => ({
          ...prev,
          id: result.id,
          status: dataToSave.status,
          published_at: dataToSave.published_at,
        }));

        // Show success message
        showToast(
          "success",
          `Blog ${
            newStatus === "published" ? "published" : "saved"
          } successfully`
        );

        // Update URL if it's a new blog
        if (isNewBlog && result.id) {
          navigate(`/admin/blog/${result.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      showToast("error", "Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle editor commands
  const handleFormatCommand = (command, params = null) => {
    if (formatCommands[command]) {
      formatCommands[command](params);
      // Focus back on editor
      if (editorRef.current) {
        editorRef.current.focus();
        handleEditorChange();
      }
    }
  };

  // Handle toggling fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Handle toggling dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle toggling sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Get the current category name
  const currentCategory =
    categories.find((c) => c.id === formData.category_id)?.name || "";

  // Get the current author
  const currentAuthor = authors.find((a) => a.id === formData.author_id);

  // Status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            Draft
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/blogs")}
                className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back to Blogs
              </button>

              <div className="h-5 w-px bg-gray-300 dark:bg-gray-700"></div>

              <div className="flex items-center">
                {getStatusBadge(formData.status)}
                {lastSaved && (
                  <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Last saved {formatDate(lastSaved)}
                  </span>
                )}
                {unsavedChanges && (
                  <span className="ml-2 text-xs text-amber-500 animate-pulse">
                    ●
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewMode(!previewMode)}
                      className={previewMode ? "text-primary" : ""}
                    >
                      <Eye size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Preview</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                    >
                      {fullscreen ? (
                        <Minimize2 size={18} />
                      ) : (
                        <Maximize2 size={18} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{darkMode ? "Light Mode" : "Dark Mode"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    {formData.status === "published" ? "Update" : "Save Draft"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Save Options</DialogTitle>
                    <DialogDescription>
                      Choose how you want to save this blog post.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Save as Draft</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Save your work but don't publish it yet.
                        </p>
                      </div>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          onClick={() => handleSave("draft")}
                          disabled={isSaving}
                        >
                          Save Draft
                        </Button>
                      </DialogClose>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Publish Now</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Save and make the blog post live immediately.
                        </p>
                      </div>
                      <DialogClose asChild>
                        <Button
                          onClick={() => handleSave("published")}
                          disabled={isSaving}
                        >
                          Publish
                        </Button>
                      </DialogClose>
                    </div>
                    {formData.published_at && (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Schedule Publication</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Choose a future date for publication.
                          </p>
                        </div>
                        <DialogClose asChild>
                          <Button
                            variant="secondary"
                            onClick={() => handleSave("scheduled")}
                            disabled={isSaving}
                          >
                            Schedule
                          </Button>
                        </DialogClose>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => handleSave("published")}
                disabled={isSaving}
                className="hidden sm:flex items-center"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${
              sidebarCollapsed
                ? "w-12 transition-all duration-300"
                : "w-72 md:w-80 transition-all duration-300"
            }`}
          >
            <div className="flex justify-between items-center p-4">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold">Blog Settings</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400"
              >
                {sidebarCollapsed ? (
                  <PanelLeft size={18} />
                ) : (
                  <PanelRightClose size={18} />
                )}
              </Button>
            </div>

            {!sidebarCollapsed && (
              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="publishing">Publishing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Featured Image
                      </label>
                      {formData.featured_image ? (
                        <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                          <img
                            src={formData.featured_image || "/placeholder.svg"}
                            alt="Featured"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById("featured-image-input")
                                  .click()
                              }
                            >
                              Change
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  featured_image: "",
                                }))
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon
                              size={24}
                              className="mb-2 text-gray-500 dark:text-gray-400"
                            />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 2MB)
                            </p>
                          </div>
                          <input
                            id="featured-image-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        This image will be displayed as the blog post thumbnail
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Category
                      </label>
                      <Select
                        value={formData.category_id || ""}
                        onValueChange={(value) =>
                          handleSelectChange("category_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.length > 0 ? (
                          formData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-gray-700 dark:text-gray-300 flex items-center gap-1"
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            No tags added yet
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddTag()
                          }
                          placeholder="Add a tag"
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddTag}
                          disabled={!newTag}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Author
                      </label>
                      <Select
                        value={formData.author_id || ""}
                        onValueChange={(value) =>
                          handleSelectChange("author_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reading Time */}
                    <div>
                      <label className="flex justify-between text-sm font-medium mb-1">
                        <span>Reading Time (minutes)</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Auto-calculated
                        </span>
                      </label>
                      <input
                        type="number"
                        name="reading_time"
                        value={formData.reading_time}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4 mt-4">
                    {/* SEO Title */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        name="seo_title"
                        value={formData.seo_title}
                        onChange={handleInputChange}
                        placeholder="SEO optimized title"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.seo_title?.length || 0}/60 characters
                        {formData.seo_title?.length > 60 && (
                          <span className="text-red-500"> (Too long)</span>
                        )}
                      </p>
                    </div>

                    {/* SEO Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Description
                      </label>
                      <textarea
                        name="seo_description"
                        value={formData.seo_description}
                        onChange={handleInputChange}
                        placeholder="Brief description for search engines"
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary resize-none"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.seo_description?.length || 0}/160 characters
                        {formData.seo_description?.length > 160 && (
                          <span className="text-red-500"> (Too long)</span>
                        )}
                      </p>
                    </div>

                    {/* SEO Keywords */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        name="seo_keywords"
                        value={formData.seo_keywords}
                        onChange={handleInputChange}
                        placeholder="keyword1, keyword2, keyword3"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Separate keywords with commas
                      </p>
                    </div>

                    {/* SEO Preview */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-900">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Search Engine Preview
                      </h3>
                      <div className="space-y-1">
                        <h4 className="text-blue-600 dark:text-blue-400 text-xl hover:underline truncate">
                          {formData.seo_title || formData.title || "Blog Title"}
                        </h4>
                        <p className="text-green-700 dark:text-green-500 text-sm">
                          www.yourdomain.com/
                          {formData.title
                            ? formData.title.toLowerCase().replace(/\s+/g, "-")
                            : "blog-post"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.seo_description ||
                            "A meta description will be generated from your content if you don't provide one."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="publishing" className="space-y-4 mt-4">
                    {/* Publication Status */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Publication Date */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Publication Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !formData.published_at &&
                              "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.published_at
                              ? formatDate(formData.published_at)
                              : "Select date and time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={
                              formData.published_at
                                ? new Date(formData.published_at)
                                : undefined
                            }
                            onSelect={handleDateChange}
                            initialFocus
                          />
                          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                            <input
                              type="time"
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary dark:focus:border-primary"
                              value={
                                formData.published_at
                                  ? new Date(formData.published_at)
                                      .toTimeString()
                                      .slice(0, 5)
                                  : ""
                              }
                              onChange={(e) => {
                                if (formData.published_at) {
                                  const date = new Date(formData.published_at);
                                  const [hours, minutes] =
                                    e.target.value.split(":");
                                  date.setHours(Number.parseInt(hours, 10));
                                  date.setMinutes(Number.parseInt(minutes, 10));
                                  handleDateChange(date);
                                }
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Featured Post */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Featured Post
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Display this blog on the homepage
                        </p>
                      </div>
                      <Switch
                        checked={formData.is_featured}
                        onCheckedChange={(checked) =>
                          handleSelectChange("is_featured", checked)
                        }
                      />
                    </div>

                    {/* Auto-save */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Auto-save</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Automatically save changes every 30 seconds
                        </p>
                      </div>
                      <Switch
                        checked={autoSaveEnabled}
                        onCheckedChange={setAutoSaveEnabled}
                      />
                    </div>

                    {/* Delete Blog Post */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full mt-4">
                          <Trash2 size={16} className="mr-2" />
                          Delete Blog Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the blog post.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              // Delete logic here
                              showToast("success", "Blog post deleted");
                              navigate("/admin/blogs");
                            }}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main
            className={`flex-1 overflow-hidden flex flex-col ${
              fullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : ""
            }`}
          >
            {fullscreen && (
              <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold truncate">
                  {formData.title || "New Blog Post"}
                </h2>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  <Minimize2 size={18} />
                </Button>
              </div>
            )}

            {previewMode ? (
              <div className="flex-1 overflow-y-auto py-8 px-4 md:px-10 lg:px-20 prose dark:prose-invert max-w-5xl mx-auto">
                <h1 className="mb-4">
                  {formData.title || "Untitled Blog Post"}
                </h1>
                {formData.subtitle && (
                  <p className="text-xl text-gray-500 dark:text-gray-400 mt-2 mb-6">
                    {formData.subtitle}
                  </p>
                )}

                {formData.featured_image && (
                  <img
                    src={formData.featured_image || "/placeholder.svg"}
                    alt={formData.title}
                    className="w-full max-h-[400px] object-cover rounded-lg mb-8"
                  />
                )}

                <div className="flex items-center mb-8">
                  {currentAuthor && (
                    <div className="flex items-center">
                      <img
                        src={currentAuthor.avatar || "/placeholder.svg"}
                        alt={currentAuthor.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">{currentAuthor.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(formData.published_at || new Date())} ·{" "}
                          {formData.reading_time} min read
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: formData.content || "<p>No content yet...</p>",
                  }}
                />

                {formData.tags.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <h3>Tags:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Title and Subtitle */}
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title..."
                    className="w-full text-4xl font-bold placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 mb-2"
                  />
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Enter subtitle (optional)..."
                    className="w-full text-xl text-gray-500 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Formatting Toolbar */}
                <div className="border-b border-gray-200 dark:border-gray-800 p-2 overflow-x-auto hide-scrollbar">
                  <div className="flex items-center space-x-1 min-w-max">
                    {/* Heading options */}
                    <Select
                      onValueChange={(value) => handleFormatCommand(value)}
                      defaultValue="p"
                    >
                      <SelectTrigger className="h-8 border-none min-w-[130px] focus:ring-0">
                        <SelectValue placeholder="Paragraph" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p">Paragraph</SelectItem>
                        <SelectItem value="h1">Heading 1</SelectItem>
                        <SelectItem value="h2">Heading 2</SelectItem>
                        <SelectItem value="h3">Heading 3</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                    {/* Text formatting */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("bold")}
                          >
                            <Bold size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bold</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("italic")}
                          >
                            <Italic size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Italic</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("underline")}
                          >
                            <Underline size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Underline</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                    {/* Text alignment */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("alignLeft")}
                          >
                            <AlignLeft size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Left</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("alignCenter")}
                          >
                            <AlignCenter size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Center</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("alignRight")}
                          >
                            <AlignRight size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Align Right</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                    {/* Lists */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("ul")}
                          >
                            <List size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bullet List</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("ol")}
                          >
                            <ListOrdered size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Numbered List</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

                    {/* Insert options */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("link")}
                          >
                            <LinkIcon size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              document
                                .getElementById("insert-image-input")
                                .click()
                            }
                          >
                            <ImageIcon size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert Image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("quote")}
                          >
                            <Quote size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Blockquote</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleFormatCommand("code")}
                          >
                            <Code size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Code Block</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <input
                      id="insert-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleInsertImage}
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  <div className="max-w-3xl mx-auto">
                    <div
                      ref={editorRef}
                      className="min-h-[300px] prose dark:prose-invert max-w-none focus:outline-none"
                      contentEditable
                      onInput={handleEditorChange}
                      placeholder="Start writing your blog post..."
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Action Bar */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className={previewMode ? "bg-gray-100 dark:bg-gray-800" : ""}
          >
            <Eye size={16} className="mr-2" />
            Preview
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            Save Draft
          </Button>

          <Button onClick={() => handleSave("published")} disabled={isSaving}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogManagementPage;
