import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration
from scipy.io.wavfile import write

print("Loading AI music generation model...")

model_name = "facebook/musicgen-small"

processor = AutoProcessor.from_pretrained(model_name)
model = MusicgenForConditionalGeneration.from_pretrained(model_name)

print("Model loaded successfully!")

prompt = input("Enter music description: ")

inputs = processor(
    text=[prompt],
    padding=True,
    return_tensors="pt"
)

print("Generating music... Please wait...")

audio_values = model.generate(
    **inputs,
    do_sample=True,
    guidance_scale=3,
    max_new_tokens=256
)

sampling_rate = model.config.audio_encoder.sampling_rate

audio = audio_values[0, 0].detach().cpu().numpy()

write(
    "generated_music.wav",
    sampling_rate,
    audio
)

print("Music generated successfully!")
print("Saved as: generated_music.wav")