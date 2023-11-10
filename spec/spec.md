# The `memespec` Specification


## Introduction

The `memespec` specification is a specification for describing meme templates. It is intended as a format which allows both humans and computers to create and understand meme templates. Renderers may be built on top of this specification to render meme templates into images, animations, or other formats.

## Types

The following section defines all types used in the `memespec` specification.

### Meme parts

#### Attachment

An attachment is a file that is attached to a meme. It has the following properties:

- type: `string` - The type of the attachment. Must be one of the following values:
    - `url` - A URL attachment.
    - `base64` - A base64-encoded string attachment.
- value: `string` - The value of the attachment. If the type is `url`, this is the URL of the attachment. If the type is `base64`, this is the base64-encoded string of the attachment.

### AnimationCut

An animation cut is a cut in an animation. It has the following properties:

- unit: `string` - The unit of the animation cut. Must be one of the following values:
    - `ms` - Milliseconds. This is the default value.
    - `frame` - Frames.
- start: `integer` - The amount to cut from the start of the animation. Defaults to `0`.
- end: `integer` - The amount to cut from the end of the animation. Defaults to `0`.


#### BaseMemePart

A `BaseMemePart` is a base type for all meme parts. It has the following properties:

- name: `string` - The name of the meme part. This is used to identify the meme part in the `meme` object. It must be unique within the meme template.
- style: `string` - The style of the meme part. This is a CSS style string which is applied to the meme part.
- type: `string` - The type of the meme part. It must be one of the following values:
  - `input` - An input meme part.
  - `text` - A text meme part.
  - `image` - An image meme part.
  - `animation` - An animation meme part.
  - `group` - A group meme part.
  - `stillGroup` - A still group meme part.

#### InputMemePart

Input meme parts are used for collecting text inputs from the user, that differ for each meme instance. They have the following properties:


- (optional) placeholder: `string` - The placeholder text to display in the input field.
- (optional) optional: `boolean` - Whether or not the input is optional. If it is not optional, the user must enter text before the meme can be rendered. Defaults to `false`.
- type: `string` - The type of the meme part. Must be `input`.

All other properties are inherited from `BaseMemePart`.

#### TextMemePart

Text meme parts are used for displaying text that is static for all memes in the template. They have the following properties:

- text: `string` - The text to display.
- type: `string` - The type of the meme part. Must be `text`.

All other properties are inherited from `BaseMemePart`.

#### ImageMemePart

Image meme parts are used for displaying images in the meme template. They have the following properties:

- attachment: `Attachment` - The attachment to display.
- type: `string` - The type of the meme part. Must be `image`.

All other properties are inherited from `BaseMemePart`.

#### AnimationMemePart

Animation meme parts are used for displaying animations in the meme template. They have the following properties:

- attachment: `Attachment` - The attachment to display.
- (optional) cut: `AnimationCut` - The cut to apply to the animation.
- type: `string` - The type of the meme part. Must be `animation`.

All other properties are inherited from `BaseMemePart`.

#### GroupMemePart

Group meme parts are used for grouping meme parts together. They have the following properties:

- parts: `MemePart[]` - The meme parts to group together.
- type: `string` - The type of the meme part. Must be `group`.

All other properties are inherited from `BaseMemePart`.

#### MemePart

A meme part is a union of:
- `InputMemePart`
- `TextMemePart`
- `ImageMemePart`
- `AnimationMemePart`
- `GroupMemePart`
- `StillGroupMemePart`

#### StillGroupMemePart

Still group meme parts are used for grouping still meme parts together. They have the following properties:

- parts: `StillMemePart[]` - The meme parts to group together.
- type: `string` - The type of the meme part. Must be `stillGroup`.

#### StillMemePart

A still meme part is a meme part that is not animated. It is a union of:
- `InputMemePart`
- `TextMemePart`
- `ImageMemePart`
- `StillGroupMemePart`


### Meme Templates


#### BaseMemeTemplate

A `BaseMemeTemplate` is a base type for all meme templates. It has the following properties:

- id: `UUID` - The ID of the meme template.
- name: `string` - The name of the meme template. This is used to identify the meme in the meme collection. It must be unique within the meme collection.
- (optional) description: `string` - The description of the meme template.
- (optional) author: `string` - The author of the meme template.
- (optional) examples: `Map<string, string>[]` - Examples of inputs for the meme template. All keys must be names of input meme parts.
- style: `string` - The style of the meme template. This is a CSS style string which is applied to the meme template.
- type: `string` - The type of the meme template. It must be one of the following values:
  - `still` - A still meme template.
  - `animated` - An animated meme template.
  - `multiAnimated` - A meme templates with multiple animations.


#### StillMemeTemplate

A still meme template is a meme template that is not animated. It has the following properties:

- parts: `StillMemePart[]` - The meme parts of the meme template.
- type: `string` - The type of the meme template. Must be `still`.

All other properties are inherited from `BaseMemeTemplate`.

#### AnimatedMemeTemplate

An animated meme template is a meme template that is animated. It has the following properties:

- parts: `MemePart[]` - The meme parts of the meme template.
- duration: `integer` - The duration of the animation in milliseconds.
- type: `string` - The type of the meme template. Must be `animated`.

All other properties are inherited from `BaseMemeTemplate`.

#### AnimationPart

An animation part is a part of an animation. It has the following properties:

- parts: `MemePart[]` - The meme parts of the animation part.
- duration: `integer` - The duration of the animation part in milliseconds.

#### MultiAnimatedMemeTemplate

A multi-animated meme template is a meme template that has multiple animations. It has the following properties:

- parts: `AnimationPart[]` - The animation parts of the meme template.
- type: `string` - The type of the meme template. Must be `multiAnimated`.

All other properties are inherited from `BaseMemeTemplate`.

#### MemeTemplate

A meme template is a union of:
- `StillMemeTemplate`
- `AnimatedMemeTemplate`
- `MultiAnimatedMemeTemplate`

### Meme Collections

#### MemeCollection

A meme collection is a collection of meme templates. It has the following properties:

- name: `string` - The name of the meme collection.
- (optional) description: `string` - The description of the meme collection.
- (optional) author: `string` - The author of the meme collection.
- templates: `MemeTemplate[]` - The meme templates in the meme collection.

## Rendering

The following section defines how to render a meme template into an image, animation, or other format.

A renderer accepts a meme template and inputs, and renders the meme template into an image, animation, or other format.

### Rendering basics

All meme templates are defined over CSS and HTML. Renderers should render the meme template into an image, animation, or other format by rendering the meme template into HTML, and then, if necessary, rendering the HTML into an image, animation, or other format.

### HTML tags

Renderers should conver the following types to the following HTML tags with the following CSS classes:
- `InputMemePart` - `<div class="text-meme-part"></div>`
- `TextMemePart` - `<div class="text-meme-part"></div>`
- `ImageMemePart` - `<img class="image-meme-part" />`
- `AnimationMemePart` - `<img class="animation-meme-part" />`
- `GroupMemePart` - `<div class="group-meme-part"></div>`
- `StillGroupMemePart` - `<div class="group-meme-part"></div>`
- `MemeTemplate` - `<div class="meme-template"></div>`

### Base CSS styles

Renderers may use different underlying HTML engines, and may have different default CSS styles. To ensure that all meme templates are rendered consistently, renderers should apply the following base CSS styles to all meme templates:

```css
.meme-template {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    color: black;
    text-shadow: 0 0 8px white;
    position: relative;
}

/* make text not exceed width of image, but break line instead */
.meme-template .text-meme-part {
    background-color: transparent;
    word-wrap: break-word;
    border: none;
    margin: 0px;
    padding: 6px 2px;
    box-sizing: border-box;
    font-family: sans-serif;
    font-size: 24px;
    color: black;
    text-shadow: 0 0;
}

.meme-template .image-meme-part {
    justify-content: center;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.meme-template .animation-meme-part {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
}

.meme-template .group-meme-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: transparent;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    color: black;
    text-shadow: 0 0 8px white;
    position: relative;
}
```

### Supporting meme template types

For a lot of renderers, rendering just `still` meme templates is enough. And for the vast majority of editors, rendering just `still` and `animated` meme types will be enough. 

When a renderer loads a meme template or meme collection, it should simply ignore any meme templates that it does not support, using the `BaseMemeTemplate.type` property.

### 
