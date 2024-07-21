classDiagram
direction BT
class pages {
   varchar(255) title
   text content
   timestamp created_at
   int svg_id
   int active
   text additional
   int id
}
class svg_element_properties {
   int svg_id
   varchar(255) element_id
   varchar(255) property_key
   longtext property_value
   int id
}
class svg_element_texts {
   int svg_id
   varchar(255) element_id
   text text
   text additional_text
   int id
}
class svg_elements {
   int svg_id
   varchar(255) element_id
   text properties
   text description
   int id
}
class svgs {
   longtext content
   text properties
   text description
   int page_id
   int id
}
class users {
   int role_id
   varchar(255) email
   varchar(255) password
   varchar(255) name
   timestamp created_at
   int id
}

pages  -->  svgs : svg_id:id
svg_element_properties  -->  svgs : svg_id:id
svg_element_texts  -->  svgs : svg_id:id
svg_elements  -->  svgs : svg_id:id
svgs  -->  pages : page_id:id
