const StillMemetemplateSchema = {
    "$defs": {
        "AnimationCut": {
            "properties": {
                "unit": {
                    "default": "ms",
                    "enum": [
                        "ms",
                        "frame"
                    ],
                    "title": "Unit",
                    "type": "string"
                },
                "start": {
                    "default": 0,
                    "title": "Start",
                    "type": "integer"
                },
                "end": {
                    "default": 0,
                    "title": "End",
                    "type": "integer"
                }
            },
            "title": "AnimationCut",
            "type": "object"
        },
        "AnimationMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "animation",
                    "default": "animation",
                    "title": "Type"
                },
                "attachment": {
                    "$ref": "#/$defs/Attachment"
                },
                "cut": {
                    "anyOf": [
                        {
                            "$ref": "#/$defs/AnimationCut"
                        },
                        {
                            "type": "null"
                        }
                    ],
                    "default": null
                }
            },
            "required": [
                "name",
                "style",
                "attachment"
            ],
            "title": "AnimationMemePart",
            "type": "object"
        },
        "Attachment": {
            "properties": {
                "type": {
                    "enum": [
                        "url",
                        "base64"
                    ],
                    "title": "Type",
                    "type": "string"
                },
                "value": {
                    "title": "Value",
                    "type": "string"
                }
            },
            "required": [
                "type",
                "value"
            ],
            "title": "Attachment",
            "type": "object"
        },
        "GroupMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "group",
                    "default": "group",
                    "title": "Type"
                },
                "parts": {
                    "items": {
                        "discriminator": {
                            "mapping": {
                                "image": "#/$defs/ImageMemePart",
                                "input": "#/$defs/InputMemePart",
                                "stillGroup": "#/$defs/StillGroupMemePart",
                                "text": "#/$defs/TextMemePart"
                            },
                            "propertyName": "type"
                        },
                        "oneOf": [
                            {
                                "$ref": "#/$defs/InputMemePart"
                            },
                            {
                                "$ref": "#/$defs/TextMemePart"
                            },
                            {
                                "$ref": "#/$defs/ImageMemePart"
                            },
                            {
                                "$ref": "#/$defs/StillGroupMemePart"
                            }
                        ]
                    },
                    "title": "Parts",
                    "type": "array"
                }
            },
            "required": [
                "name",
                "style",
                "parts"
            ],
            "title": "GroupMemePart",
            "type": "object"
        },
        "ImageMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "image",
                    "default": "image",
                    "title": "Type"
                },
                "attachment": {
                    "$ref": "#/$defs/Attachment"
                }
            },
            "required": [
                "name",
                "style",
                "attachment"
            ],
            "title": "ImageMemePart",
            "type": "object"
        },
        "InputMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "input",
                    "default": "input",
                    "title": "Type"
                },
                "placeholder": {
                    "anyOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "null"
                        }
                    ],
                    "default": null,
                    "title": "Placeholder"
                },
                "optional": {
                    "default": false,
                    "title": "Optional",
                    "type": "boolean"
                }
            },
            "required": [
                "name",
                "style"
            ],
            "title": "InputMemePart",
            "type": "object"
        },
        "StillGroupMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "stillGroup",
                    "default": "stillGroup",
                    "title": "Type"
                },
                "parts": {
                    "items": {
                        "anyOf": [
                            {
                                "$ref": "#/$defs/InputMemePart"
                            },
                            {
                                "$ref": "#/$defs/TextMemePart"
                            },
                            {
                                "$ref": "#/$defs/ImageMemePart"
                            },
                            {
                                "$ref": "#/$defs/AnimationMemePart"
                            },
                            {
                                "$ref": "#/$defs/GroupMemePart"
                            }
                        ]
                    },
                    "title": "Parts",
                    "type": "array"
                }
            },
            "required": [
                "name",
                "style",
                "parts"
            ],
            "title": "StillGroupMemePart",
            "type": "object"
        },
        "TextMemePart": {
            "properties": {
                "name": {
                    "title": "Name",
                    "type": "string"
                },
                "style": {
                    "title": "Style",
                    "type": "string"
                },
                "type": {
                    "const": "text",
                    "default": "text",
                    "title": "Type"
                },
                "text": {
                    "title": "Text",
                    "type": "string"
                }
            },
            "required": [
                "name",
                "style",
                "text"
            ],
            "title": "TextMemePart",
            "type": "object"
        }
    },
    "properties": {
        "id": {
            "title": "Id",
            "type": "string"
        },
        "name": {
            "title": "Name",
            "type": "string"
        },
        "description": {
            "title": "Description",
            "type": "string"
        },
        "author": {
            "title": "Author",
            "type": "string"
        },
        "examples": {
            "items": {
                "additionalProperties": {
                    "type": "string"
                },
                "type": "object"
            },
            "title": "Examples",
            "type": "array"
        },
        "style": {
            "title": "Style",
            "type": "string"
        },
        "type": {
            "const": "still",
            "default": "still",
            "title": "Type"
        },
        "parts": {
            "items": {
                "discriminator": {
                    "mapping": {
                        "image": "#/$defs/ImageMemePart",
                        "input": "#/$defs/InputMemePart",
                        "stillGroup": "#/$defs/StillGroupMemePart",
                        "text": "#/$defs/TextMemePart"
                    },
                    "propertyName": "type"
                },
                "oneOf": [
                    {
                        "$ref": "#/$defs/InputMemePart"
                    },
                    {
                        "$ref": "#/$defs/TextMemePart"
                    },
                    {
                        "$ref": "#/$defs/ImageMemePart"
                    },
                    {
                        "$ref": "#/$defs/StillGroupMemePart"
                    }
                ]
            },
            "title": "Parts",
            "type": "array"
        }
    },
    "required": [
        "id",
        "name",
        "description",
        "author",
        "examples",
        "style",
        "parts"
    ],
    "title": "StillMemeTemplate",
    "type": "object"
}

export default StillMemetemplateSchema;