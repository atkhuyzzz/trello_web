
import Button from '@mui/material/Button'
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import  Typography  from '@mui/material/Typography'
import {useColorScheme} from '@mui/material/styles'


function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  );
}



function App() {
  

  return (
    <>
    <ModeToggle/>
    <hr />
    <div>atkhuyzzz</div>

    <Typography variant="body2" color="text.secondary">heheh</Typography>

      <Button variant="contained">Hello world</Button>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <br/>
      <AccessAlarm/>
      <ThreeDRotation/>
    </>
  )
}

export default App
