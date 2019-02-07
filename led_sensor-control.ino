/*temperature sensor, RGBled*/

#include <Wire.h>
// the setup function runs once when you press reset or power the board
void* __dso_handle;

#define RED 6
#define GREEN 3
#define BLUE 5

unsigned char LM75_address = 0x48;
const unsigned char config_pointer = 0x01;
const unsigned char Temp_pointer = 0x00;

const int READ_PINS = 1;
const int WRITE_ANALOG = 2;
const int WRITE_DIGITAL = 3;

const int START_MSG = 0xF0;
const int END_MSG = 0xF7;

int incommingByte = 0; 
int secondByte = 0;
int outputByte;
int i;
int inputMsg[5];
int R=0,G=0,B=0;
int color;
float temp;
int temp_value;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(GREEN,OUTPUT);
  pinMode(BLUE,OUTPUT);
  analogWrite(RED, 255);
  analogWrite(GREEN, 255);
  analogWrite(BLUE, 255);
  Serial.begin(9600);
  Wire.begin();
  Serial.println("start");
  Wire.beginTransmission(LM75_address); 
  Wire.write(config_pointer);
  Wire.write(Temp_pointer);
  Wire.endTransmission();
  Wire.beginTransmission(LM75_address);
  Wire.write(Temp_pointer);
  Wire.endTransmission;
}


void loop(){

if(Serial.available() > 0){
    Wire.requestForm(LM75_address, 2);
    float temp = ((( Wire.read() << 8) | Wire.read()) >> 5 ) * 0.125;
    temp_value = temp;
  
    // input available byte
    incommingByte = Serial.read();

      if(incommingByte == READ_PINS){
        
        inputMsg[0] = START_MSG;
        inputMsg[1] = temp_value;
        inputMsg[2] = END_MSG;
        for(int i = 0; i < 3; i++){
          Serial.write(inputMsg[i]);  
        }
        
      }else if(incommingByte == WRITE_ANALOG){
        // input second byte
        outputByte = Serial.read();
        if(outputByte == 1){
          //turn on selected color
          for(i=0;i<3;i++){
              int x = Serial.read();
              int y = Serial.read();
              int z = Serial.read();
              if(i==0){
                  analogWrite(RED, x*100+y*10+z);
              }else if(i==1){
                  analogWrite(GREEN, x*100+y*10+z);
              }else{
                  analogWrite(BLUE, x*100+y*10+z);
              }
          }
        }else if(outputByte == 0){
          // Turn off led
          analogWrite(RED, 255);
          analogWrite(GREEN, 255);
          analogWrite(BLUE, 255);
        }else if(outputByte == 2){
          // Blink R or G or B LED
          secondByte = Serial.read();
          if(secondByte == 0){
             color = RED;
          }else if(secondByte == 1){
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
