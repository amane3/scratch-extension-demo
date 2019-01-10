/*
Input Serial for changing led functions.
*/

// the setup function runs once when you press reset or power the board
void* __dso_handle;

const int READ_PINS = 1;
const int WRITE_ANALOG = 2;
const int WRITE_DIGITAL = 3;

const int START_MSG = 0;
const int END_MSG = 0;

int incommingByte=0; 
int outputByte;
int i;
int inputMsg;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  analogWrite(LED_BUILTIN, 255);
  Serial.begin(9600);
}


void loop(){

if(Serial.available() > 0){
    // input available byte
    incommingByte = Serial.read();

      if(incommingByte == READ_PINS){
        
        inputMsg=START_MSG;
        Serial.write('0');
        
      }else if(incommingByte == WRITE_ANALOG){
        
        outputByte = Serial.read();
        if(outputByte == 0){
          analogWrite(LED_BUILTIN, 255);
        }else if(outputByte == 1){
          analogWrite(LED_BUILTIN, 0);
        }else if(outputByte == 2){
          for(i=0;i<256;i++){
          analogWrite(LED_BUILTIN, i);
          delay(3);
          }        
        for(i=255;i>=0;i--){
          analogWrite(LED_BUILTIN, i);
          delay(3);
          }
        }
      }else{
      }
        
   
}
delay(1);
}
