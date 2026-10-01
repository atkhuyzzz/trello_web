
import Button from '@mui/material/Button'
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material'
import  Typography  from '@mui/material/Typography'
import {useColorScheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { 
  LightMode as LightModeIcon, 
  DarkModeOutlined as DarkModeOutlinedIcon, 
  SettingsBrightness as SettingsBrightnessIcon,
} from '@mui/icons-material'

 function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectedMode=event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        
        <MenuItem value="light">
          <div style={{display:'flex', alignItems: 'center', gap:'8px'}}>
            <LightModeIcon fontSize='small'/> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <div style={{display:'flex', alignItems: 'center', gap:'8px'}}>
            <DarkModeOutlinedIcon fontSize='small'/> Dark
          </div>
        </MenuItem>
        <MenuItem value="system">
          <div style={{display:'flex', alignItems: 'center', gap:'8px'}}>
            <SettingsBrightnessIcon fontSize='small'/> System
          </div>
        </MenuItem>
      </Select>
    </FormControl>
  );
}



function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  // console.log('prefersDarkMode:',prefersDarkMode);
  // console.log('prefersLightMode: ',prefersLightMode);
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
    <ModeSelect/>
    <hr />
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
