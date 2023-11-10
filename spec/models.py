import json
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, TypeAdapter


class Attachment(BaseModel):
    type: Literal["url", "base64"]
    value: str

class AnimationCut(BaseModel):
    unit: Literal["ms", "frame"] = "ms"
    start: int = 0
    end: int = 0

class BaseMemePart(BaseModel):
    name: str
    style: str
    type: Literal["input", "text", "image", "animation", "group", "stillGroup"]

class InputMemePart(BaseMemePart):
    placeholder: str | None = None
    optional: bool = False
    type: Literal["input"] = "input"

class TextMemePart(BaseMemePart):
    text: str
    type: Literal["text"] = "text"

class ImageMemePart(BaseMemePart):
    attachment: Attachment
    type: Literal["image"] = "image"

class AnimationMemePart(BaseMemePart):
    attachment: Attachment
    cut: AnimationCut | None = None
    type: Literal["animation"] = "animation"

class GroupMemePart(BaseMemePart):
    parts: list["StillMemePart"]
    type: Literal["group"] = "group"

class StillGroupMemePart(BaseMemePart):
    parts: list["MemePart"]
    type: Literal["stillGroup"] = "stillGroup"

StillMemePart = InputMemePart | TextMemePart | ImageMemePart | StillGroupMemePart
MemePart = InputMemePart | TextMemePart | ImageMemePart | AnimationMemePart | GroupMemePart | StillGroupMemePart

class BaseMemeTemplate(BaseModel):
    id: str
    name: str
    description: str | None = None
    author: str | None = None
    examples: list[dict[str, str]] | None = None
    style: str
    type: Literal["still", "animated", "multiAnimated"]

class StillMemeTemplate(BaseMemeTemplate):
    parts: list[StillMemePart]
    type: Literal["still"] = "still"

class AnimatedMemeTemplate(BaseMemeTemplate):
    parts: list[MemePart]
    duration: int
    type: Literal["animated"] = "animated"

class AnimationPart(BaseModel):
    parts: list[MemePart]
    duration: int

class MultiAnimatedMemeTemplate(BaseMemeTemplate):
    parts: list[AnimationPart]
    type: Literal["multiAnimated"] = "multiAnimated"

MemeTemplate = StillMemeTemplate | AnimatedMemeTemplate | MultiAnimatedMemeTemplate

class MemeCollection(BaseModel):
    name: str
    description: str
    author: str
    templates: list[MemeTemplate]


exported_models = {
    "MemeCollection": MemeCollection,
    "MemeTemplate": MemeTemplate,
    "StillMemeTemplate": StillMemeTemplate,
    "AnimatedMemeTemplate": AnimatedMemeTemplate,
    "MultiAnimatedMemeTemplate": MultiAnimatedMemeTemplate,
}
for model_name, model in exported_models.items():
    path = Path("spec") / Path("schemas") / f"{model_name}.json"
    path.parent.mkdir(parents=True, exist_ok=True)

    json.dump(TypeAdapter(model).json_schema(), path.open("w"), indent=2)