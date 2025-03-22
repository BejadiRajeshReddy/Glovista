"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Trash2, Plus } from "lucide-react";

const ProductDescriptionForm = ({ formData, setFormData }) => {
  const [description, setDescription] = useState({
    main_heading: "",
    paragraphs: [],
    bullet_points: [],
    points: [],
  });

  useEffect(() => {
    if (formData.product_description) {
      setDescription({
        main_heading: formData.product_description.main_heading || "",
        paragraphs: formData.product_description.paragraphs || [],
        bullet_points: formData.product_description.bullet_points || [],
        points: formData.product_description.points || [],
      });
    }
  }, [formData.product_description]);

  const updateFormData = (newDescription) => {
    setFormData((prev) => ({
      ...prev,
      product_description: newDescription,
    }));
  };

  const updateMainHeading = (value) => {
    const newDescription = { ...description, main_heading: value };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const addSection = (sectionName) => {
    const newSection = { heading: "", items: [] };
    const newDescription = {
      ...description,
      [sectionName]: [...description[sectionName], newSection],
    };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const updateSection = (sectionName, index, field, value) => {
    const newSections = [...description[sectionName]];
    newSections[index][field] = value;
    const newDescription = { ...description, [sectionName]: newSections };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const removeSection = (sectionName, index) => {
    const newSections = description[sectionName].filter((_, i) => i !== index);
    const newDescription = { ...description, [sectionName]: newSections };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const addItem = (sectionName, sectionIndex) => {
    const newSections = [...description[sectionName]];
    newSections[sectionIndex].items.push("");
    const newDescription = { ...description, [sectionName]: newSections };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const updateItem = (sectionName, sectionIndex, itemIndex, value) => {
    const newSections = [...description[sectionName]];
    newSections[sectionIndex].items[itemIndex] = value;
    const newDescription = { ...description, [sectionName]: newSections };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const removeItem = (sectionName, sectionIndex, itemIndex) => {
    const newSections = [...description[sectionName]];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    const newDescription = { ...description, [sectionName]: newSections };
    setDescription(newDescription);
    updateFormData(newDescription);
  };

  const renderSection = (sectionName, sectionTitle) => (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">{sectionTitle}</h3>
      {(description[sectionName] || []).map((item, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <Input
            placeholder="Heading"
            value={item.heading}
            onChange={(e) =>
              updateSection(sectionName, index, "heading", e.target.value)
            }
            className="mb-2"
          />
          {sectionName === "paragraphs" ? (
            <textarea
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                updateSection(sectionName, index, "description", e.target.value)
              }
              rows={4}
              className="w-full p-2 border rounded"
            />
          ) : (
            <div className="space-y-2">
              {item.items.map((point, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder={`${sectionTitle} item`}
                    value={point}
                    onChange={(e) =>
                      updateItem(sectionName, index, itemIndex, e.target.value)
                    }
                    className="flex-grow"
                  />
                  <Button
                    onClick={() => removeItem(sectionName, index, itemIndex)}
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => addItem(sectionName, index)}
                variant="outlined"
                size="sm"
                className="flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          )}
          <Button
            onClick={() => removeSection(sectionName, index)}
            variant="destructive"
            size="sm"
            className="mt-2 flex"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove {sectionTitle}
          </Button>
        </div>
      ))}
      <Button
        onClick={() => addSection(sectionName)}
        variant="outlined"
        className="flex "
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2 " />
        Add {sectionTitle}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Product Description</h2>

      <div>
        <Input
          placeholder="Main Heading"
          value={description.main_heading}
          onChange={(e) => updateMainHeading(e.target.value)}
          className="w-full"
        />
      </div>

      {renderSection("paragraphs", "Paragraph")}
      {renderSection("bullet_points", "Bullet Point")}
      {renderSection("points", "Point")}
    </div>
  );
};

export default ProductDescriptionForm;
