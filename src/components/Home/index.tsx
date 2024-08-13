import {useState, useEffect} from "react";
import { Wrapper,Card,Templates,Form,Button} from "./styles";
import logo from "../../assets/logo.svg";
import qs from "qs";

interface Template {
    id: string;
    url: string;
    name: string;
    box_count: number;
}

export default function Home() {
    
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [boxes, setBoxes] = useState<string[]>([]);
    const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const resp = await fetch('https://api.imgflip.com/get_memes');
            const {data: {memes}} = await resp.json();
            setTemplates(memes);
        })();
    }, []);


    const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = boxes;
        newValues[index] = e.target.value;
        setBoxes(newValues);
    }

    function handleSelectTemplate(template: Template) {
        setSelectedTemplate(template);
        setBoxes([]);
    }

   async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const params = qs.stringify({
            
                template_id: selectedTemplate?.id,
                username: 'vikayel543',
                password: 'vikayel543',
                boxes: boxes.map(text => ({text}))
        })
        
        const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
        const {data : {url}} = await resp.json();

        setGeneratedMeme(url)
    }
        function handleReset() {
            setSelectedTemplate(null);
            setBoxes([]);
            setGeneratedMeme(null);
        }

    
    return (
        <Wrapper>
        <img src={logo} alt="MemeMaker" />
        <Card>
            {generatedMeme && (
                <>
                    <img src={generatedMeme} alt="Generated Meme" />
                    <Button type="button" onClick={handleReset}>Criar outro meme</Button>
                </>
            )}
           {!generatedMeme && (
            <>
             <h2>Selecione um template</h2>
            <Templates>
                {templates.map((template) => (
                    <button 
                    key = {template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template)}
                    
                    className={template.id === selectedTemplate?.id ? 'selected' : '' }
                    >
                    <img src={template.url} alt={template.name}/>
                </button>))}
            </Templates>

            {selectedTemplate && (
                <>
                <h2>Textos</h2>
            <Form onSubmit={handleSubmit}>
                {(new Array(selectedTemplate.box_count)).fill('').map((_,index) => (
                    <input 
                    key ={String(Math.random())}
                    placeholder={`Texto #${index + 1}`}
                    onChange={handleInputChange(index)}
                    />
                ))}
              
                <Button type="submit">MakeMyMeme!</Button>
            </Form>
                </>
            )}
            </>
           )}
        </Card>
        </Wrapper>
        
    );
    }