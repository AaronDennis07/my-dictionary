
import {List,
  ListItem,
  ListItemText,
} from "@mui/material";

const DisplayData = (props)=>{
    if(props.feed.length !== 0){
        console.log("adaadas",typeof(props.feed))
    return (
        <List>
          {  props.feed.map((a,i)=>{
                return (
                    <ListItem key={i} disablePadding>
              <ListItemText key={i} primary={`${i+1}. ${a}`} />
            </ListItem>
                )
            })
            
           }
          </List>
    )
        }
        return <p>Data not found</p>
}

export default DisplayData