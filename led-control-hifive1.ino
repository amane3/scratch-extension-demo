/*
Input Serial for changing RGBled.
*/

// the setup function runs once when you press reset or power the board
void* __dso_handle;

#define RED 6
#define GREEN 3
#define BLUE 5

const int READ_PINS = 1;
const int WRITE_ANALOG = 2;
const int WRITE_DIGITAL = 3;

const int START_MSG = 0;
const int END_MSG = 0;

int incommingByte=0; 
int outputByte;
int i;
int inputMsg;
int R=0,G=0,B=0;
int color;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(GREEN,OUTPUT);
  pinMode(BLUE,OUTPUT);
  analogWrite(RED, 255);
  analogWrite(GREEN, 255);
  analogWrite(BLUE, 255);
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
        // input second byte
        outputByte = Serial.read();
        if(outputByte == 1){
          //turn on selected color
          R += 100*Serial.read();
          R += 10*Serial.read();
          R += Serial.read();
          G += 100*Serial.read();
          G += 10*Serial.read();
          G += Serial.read();
          B += 100*Serial.read();
          B += 10*Serial.read();
          B += Serial.read();
          analogWrite(RED, R);
          analogWrite(GREEN, G);
          analogWrite(BLUE, B);
        }else if(outputByte == 0){
          // Turn off led
          analogWrite(RED, 255);
          analogWrite(GREEN, 255);
          analogWrite(BLUE, 255);
        }else if(outputByte == 2){
          // Blink R or G or B LED
          inputMsg = Serial.read();
          if(inputMsg == 0){
             color = RED;
          }else if(inputMsg == 1){
             color = GREEN;
          }else{
             color = BLUE;
          }
          analogWrite(RED, 255);
          analogWrite(GREEN, 255);
          analogWrite(BLUE, 255); 
 
          for(i = 255;i>=0;i--){
             analogWrite(color, i);
             delay(3);
          }
          for(i = 0;i<=255;i++){
             analogWrite(color, i);
             delay(3);
          }
        }else if(outputByte == 3){
          // Turn off LED
          for(i=255;i>=0;i--){
             analogWrite(RED, 0);
             analogWrite(GREEN, i);
             analogWrite(BLUE, 255);
             delay(3);
          }        
          for(i=0;i<=255;i++){
             analogWrite(RED, i);
             analogWrite(GREEN, 0);
             analogWrite(BLUE, 255);
             delay(3);
          }
          for(i=255;i>=0;i--){
             analogWrite(RED, 255);
             analogWrite(GREEN, 0);
             analogWrite(BLUE, i);
             delay(3);
          }
          for(i=0;i<=255;i++){
             analogWrite(RED, 255);
             analogWrite(GREEN, i);
             analogWrite(BLUE, 0);
             delay(3);
          }
          for(i=255;i>=0;i--){
             analogWrite(RED, i);
             analogWrite(GREEN, 255);
             analogWrite(BLUE, 0);
             delay(3);
          }
          for(i=0;i<=255;i++){
             analogWrite(RED, 0);
             analogWrite(GREEN, 255);
             analogWrite(BLUE, i);
             delay(3);
          }
        }
      }else{
      }
}
delay(1);
}
