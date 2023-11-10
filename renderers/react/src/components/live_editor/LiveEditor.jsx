import React, { forwardRef } from "react";

import "./memeTemplate.css";

import { useEffect, useState, useRef } from "react";
import StillMemeTemplateSchema from "../../schemas/StillMemeTemplateSchema";
import JSONEditorReact from "../json/JsonEditor";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { Download, Refresh, Share } from "@mui/icons-material";
import html2canvas from "html2canvas";

function MemePart({ part, memeInput }) {

    if (part.type === "input" || part.type === "text") {
        return <div className="text-meme-part" STYLE={part.style}> {memeInput[part.name]}</div>
    } else if (part.type === "image") {
        return <img className="image-meme-part" src={part.attachment?.value} alt={part.name} STYLE={part.style} />
    } else if (part.type === "stillGroup") {
        return <div className="group-meme-part" STYLE={part.style}>
            {part.parts.map((part) => {
                return <MemePart part={part} memeInput={memeInput} />
            })}
        </div>
    }
}

const Meme = forwardRef(({ memeTemplate, memeInput }, ref) => {
    return <div className="meme-template" STYLE={memeTemplate.style} ref={ref}>
        {memeTemplate.parts?.map((part) => {
            return <MemePart key={part.name} part={part} memeInput={memeInput} />
        })}
    </div>
});

function getInputParts(parts) {
    const inputParts = [];
    parts.forEach((part) => {
        if (part.type === "stillGroup") {
            inputParts.push(...getInputParts(part.parts));
        } else if (part.type === "input") {
            inputParts.push(part);
        }
    });
    return inputParts;
}

function saveMeme(name, ref) {
    // Use html2canvas to render the meme
    html2canvas(ref.current, { useCORS: true }).then((canvas) => {
        canvas.toBlob((blob) => {
            const file = new File([blob], name, { type: "image/png" });
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();
        });
    });
}

function shareMeme(name, ref) {
    // Use html2canvas to render the meme
    html2canvas(ref.current).then((canvas) => {
        canvas.toBlob((blob) => {
            // Use navigator.share to share the meme
            const file = new File([blob], name, { type: "image/png" });
            navigator.share({title: name, files: [file]}).then(() => {
                console.log("Shared meme");
            }).catch((e) => {
                console.log("Error sharing meme", e);
            });
        });
    });
}

function MemeEditor({ memeTemplate, memeInput, setMemeInput }) {
    const memeRef = useRef(null);

    const setInputFromRandomExample = () => {
        // Choose random example
        const example = memeTemplate.examples[Math.floor(Math.random() * memeTemplate.examples.length)];
        // Make sure it's not the same as the current input
        if (JSON.stringify(example) === JSON.stringify(memeInput)) {
            setInputFromRandomExample();
            return;
        }
        setMemeInput(example);
    }

    return (
        <div>
            <Meme memeTemplate={memeTemplate} memeInput={memeInput} ref={memeRef} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 2, marginTop: '12px' }}>
                {getInputParts(memeTemplate.parts ?? []).map((part) =>
                    <FormControl id={part.name}>
                        <FormLabel>{part.name}{part.optional ? "" : "*"}</FormLabel>
                        <Input type="text" value={memeInput[part.name]} placeholder={part.placeholder} onChange={(e) => {
                            const newMemeInput = { ...memeInput };
                            newMemeInput[part.name] = e.target.value;
                            setMemeInput(newMemeInput);
                        }} />
                    </FormControl>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: 2, marginTop: '12px' }}>
                <Button variant="soft" startDecorator={<Refresh />} onClick={setInputFromRandomExample} >Use Example</Button>
                <Button variant="soft" startDecorator={<Download />} onClick={() => saveMeme(memeTemplate.name  + ".png", memeRef)} >Download</Button>
                <Button variant="soft" startDecorator={<Share />} onClick={() => shareMeme(memeTemplate.name + ".png", memeRef)} >Share</Button>
            </div>
        </div>
    );
}



function LiveEditor() {
    const editor = useRef(null);
    const [memeInput, setMemeInput] = useState({});
    const [memeTemplateText, setMemeTemplateText] = useState("{}");
    const [memeTemplate, setMemeTemplate] = useState({});
    const [error, setError] = useState(true);


    useEffect(() => {
        async function updateMemeTemplate() {
            try {
                setMemeTemplate(JSON.parse(memeTemplateText));
                const errors = await editor.current.jsoneditor.validate();
                if (errors.length > 0) {
                    setError(true);
                } else {
                    setError(false);
                }
            } catch (e) {
                console.log("Error parsing JSON");
                setError(true);
            }
        }
        updateMemeTemplate();
    }, [memeTemplateText]);

    return (<div style={{ width: "100%", height: '100%', display: "flex" }}>
        <div style={{ width: "50%", height: '100%' }}>
            <JSONEditorReact
                ref={editor}
                mode="code"
                allowSchemaSuggestions={true}
                schema={StillMemeTemplateSchema}
                text={memeTemplateText}
                onChangeText={(value) => setMemeTemplateText(value)}
            />
        </div>
        {!error && <div style={{ width: "50%", height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                
            </div>
            <MemeEditor memeTemplate={memeTemplate} memeInput={memeInput} setMemeInput={setMemeInput} />
        </div>}
    </div>)
};

export default LiveEditor;