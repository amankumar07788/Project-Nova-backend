<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
=======
# 👋 Welcome to My Portfolio

Hi! I am an engineering student and developer passionate about building Python, IoT, and AI-driven applications. Here you can find my core technical projects.

## 🚀 Featured AI & Python Projects

- **[🎵 AI-Music-Generator](./AI-Music-Generator)**: Generates custom audio tracks from text prompts using Hugging Face Transformers.
- **[🤖 Smart-FAQ-Chatbot](./Smart-FAQ-Chatbot)**: An automated chatbot designed to answer user inquiries efficiently.
- **[🌍 Language-Translator-Tool](./Language-Translator-Tool)**: A tool for smooth text translation across multiple languages.

---

## 🔌 IoT & Hardware Projects

*(Yahan aapka purana PIR Motion Detection system wala code ya heading rahegi)*
- **PIR Motion Detection System**: Developed using an Arduino Uno and a PIR sensor... *(jo bhi wahan pehle se likha tha, use waisa hi rehne do)*

---

## 🛠️ Tech Stack & Skills
- **Languages:** Python, C++ (Arduino)
- **Frameworks & Libraries:** PyTorch, Hugging Face
- **Tools:** Git, GitHub, VS Code, Arduino IDE
-

# PIR Motion Detection System

## Project Overview
This project is a Motion Detection System developed using an Arduino Uno and a PIR (Passive Infrared) Sensor. The system detects human movement and automatically turns ON an LED when motion is detected. The motion status is also displayed on the Serial Monitor.

## Components Used
- Arduino Uno
- PIR Motion Sensor
- LED
- 220Ω Resistor
- Breadboard
- Jumper Wires
- USB Cable

## Circuit Connections

| Component | Arduino Pin |
|-----------|-------------|
| PIR VCC | 5V |
| PIR GND | GND |
| PIR OUT | D2 |
| LED Anode (+) | D13 |
| LED Cathode (-) | GND (through 220Ω resistor) |

## Arduino Code

```cpp
const int PIR = 2;
const int LED = 13;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(LED, OUTPUT);

  digitalWrite(LED, LOW);
  Serial.begin(9600);
}

void loop() {
  int state = digitalRead(PIR);

  if (state == HIGH) {
    digitalWrite(LED, HIGH);
    Serial.println("Motion Detected");
  } else {
    digitalWrite(LED, LOW);
    Serial.println("No Motion");
  }

  delay(500);
}
```

## Working Principle
The PIR sensor detects changes in infrared radiation produced by the human body. When a person moves in front of the sensor, the PIR sensor outputs a HIGH signal to the Arduino. The Arduino processes this signal, turns ON the LED, and displays "Motion Detected" on the Serial Monitor. When no motion is detected, the LED remains OFF and "No Motion" is displayed.

## Applications
- Home Security Systems
- Smart Lighting
- Automatic Door Systems
- Office Security
- Intruder Detection
- Energy Saving Systems
- Smart Home Automation

## Output
- No Motion → LED OFF
- Motion Detected → LED ON

## Developed By
**Aman Kumar**  
B.Tech (ECE)  
Ganga Institute of Technology and Management
>>>>>>> 26b13386fb880d304a2aabbbf830d31d661d6d5e
