import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import axios from "axios";
import DisplayData from "../components/DisplayData";
import {
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import categories from "../resources/categories";

export default function Home() {
  const [form, setForm] = useState({
    word: "",
    category: "Definitions",
  });
  const [data, setData] = useState({
    definitions: [],
    examples: [],
    synonyms: [],
    word: "",
    err:false,
  
  });
  const [isLoading,setIsLoading] = useState(false)
  const [showBanner, setBanner] = useState(false);
  const [current,setCurrent] = useState('Definitions')
  const handleChange = (ele) => (e) => {
    ele === "word" &&
      setForm({
        ...form,
        word: e.target.value,
      });
    ele === "category" &&
      setForm({
        ...form,
        category: e.target.value,
      });

    console.log(form);
  };

  const handleSubmit = (w) => (e) => {
    e.preventDefault();
    setBanner(false);
    setIsLoading(true)
    
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`)
      .then((res) => {
        console.log("asdadsdaasddasasd", res.data[0].meanings[0].synonyms);
        let def = [];
        let ex = [];
        let syn = res.data[0].meanings[0].synonyms;


        def = res.data[0].meanings[0].definitions.map((d) => {
          return d.definition;
        });

        ex = res.data[0].meanings[0].definitions
          .filter((d) => {
            if (d.example) {
              return true;
            }
            return false;
          })
          .map((e) => {
            return e.example;
          });
        
        console.log("ererer", ex);
        if (!data.title === "No Definitions Found") {
          setData({
            ...data,
            word: "Not Found",
          });
        }
        setData({
          ...data,
          definitions: def,
          examples: ex,
          synonyms: syn,
          word: res.data[0].word,
          err:false
        });
        setCurrent(form.category)
        console.log(data);
        setIsLoading(false)
        setBanner(true)
        
      })
      .catch(()=>{
        setData({
          ...data,
          err: true,
        });

        setBanner(true)
        setIsLoading(false)
      })
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <header>
        <Typography align="center" variant="h6" component="h6">
          Welcome to My Dictionary
        </Typography>
      </header>
      <main>
        <form onSubmit={handleSubmit(form.word)}>
          <FormControl fullWidth>
            <Typography mt={2} mx={0.5} variant="label" component="p">
              {" "}
              Enter a Word
            </Typography>

            <TextField
              align="center"
              sx={{ marginTop: "0.5rem" }}
              id="outlined-basic"
              variant="outlined"
              value={form.word}
              onChange={handleChange("word")}
            />
            <Typography mt={2} mx={0.5} variant="label" component="p">
              {" "}
              What to Get
            </Typography>

            <Select
              defaultValue={categories[0]}
              sx={{ marginTop: "0.5rem" }}
              onChange={handleChange("category")}
            >
              {categories.map((category, i) => {
                return (
                  <MenuItem key={i} value={category}>
                    {category}
                  </MenuItem>
                );
              })}
            </Select>

            <Button
              type="submit"
              sx={{ marginTop: "1rem" }}
              variant="contained"
            >
              Find
            </Button>
          </FormControl>
        </form>
{isLoading && <Image    src='/loading.gif' height={198} width={198}/>}
 <div hidden={!showBanner}>   
{
  data.err?(<Typography mt={5} variant="h4" component="h5">
 Word Not Found
</Typography>):(  
        <div >
          <Typography mt={5} variant="h4" component="h5">
            {data.word}
          </Typography>
          <hr />
          <Typography
            mt={1}
            sx={{ fontSize: "1.5rem" }}
            variant="p"
            component="p"
          >
            {current}
          </Typography>
          {
          
          

          (current === "Definitions" && (
            <DisplayData feed={data.definitions} />
          )) ||
            (current === "Examples" && (
              <DisplayData feed={data.examples} />
            )) ||
            (current === "Synonyms" && (
              <DisplayData feed={data.synonyms} />
            ))}
        </div>)}
        </div>
      </main>
    </div>
  );
}
