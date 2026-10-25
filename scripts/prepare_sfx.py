"""Deterministic original DSP cues plus normalization of the two ElevenLabs originals."""
from pathlib import Path
import json, math, re, subprocess
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'audio-sources/sfx-20261025'
OUTPUT=ROOT/'audio/sfx/20261025'
RATE=44100
SOURCE.mkdir(parents=True,exist_ok=True)
OUTPUT.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(20261025)

def note(f,length=.3):
    t=np.arange(round(length*RATE))/RATE
    return (np.sin(2*np.pi*f*t)+.13*np.sin(2*np.pi*2.76*f*t))*np.exp(-16*t)*np.minimum(t/.006,1)

def noise(length,low,high):
    x=rng.normal(0,1,round(length*RATE))
    x=sosfilt(butter(2,[low,high],btype='bandpass',fs=RATE,output='sos'),x)
    return x/(max(abs(x)) or 1)

def place(x,y,at,gain=1):
    start=round(at*RATE);n=min(len(y),len(x)-start)
    x[start:start+n]+=gain*y[:n]

def synth(name,length):
    x=np.zeros(round(length*RATE));t=np.arange(len(x))/RATE
    if name=='correct':
        place(x,note(659,.3),0,.6);place(x,note(880,.3),.15,.6)
    elif name=='incorrect':
        place(x,note(392,.28),0,.5);place(x,note(330,.28),.13,.45)
    elif name=='seal':
        stamp=noise(.085,160,1500)*np.exp(-np.arange(round(.085*RATE))/RATE*45)
        place(x,stamp,0,.3);place(x,note(523,.4),.16,.5);place(x,note(659,.5),.32,.5)
    elif name=='voyage':
        x+=noise(length,180,2400)*(.035+.025*np.sin(2*np.pi*.6*t)**2)
        h=np.arange(round(.9*RATE))/RATE
        envelope=np.minimum(h/.12,1)*np.minimum((.9-h)/.35,1)
        horn=(np.sin(2*np.pi*180*h)+.25*np.sin(2*np.pi*360*h)+.08*np.sin(2*np.pi*540*h))*envelope
        place(x,horn,.55,.15)
        x+=noise(length,500,2800)*np.exp(-((t-2.1)/.45)**2)*.09
        x*=np.minimum(t/.1,1)*np.minimum((length-t)/.35,1)
    elif name=='lighthouse':
        place(x,noise(.045,300,1800)*np.exp(-np.arange(round(.045*RATE))/RATE*65),0,.15)
        x+=noise(length,450,2200)*np.exp(-((t-.6)/.4)**2)*.035
        for f,at in [(659,.3),(831,.5),(988,.7)]:place(x,note(f,.7),at,.4)
    x/=max(abs(x)) or 1
    x*=np.minimum(t/.005,1)*np.minimum((length-t)/.03,1)*.6
    path=SOURCE/(name+'.original.wav');write(path,RATE,(x*32767).astype(np.int16))
    return path

durations={'correct':.6,'incorrect':.5,'seal':1.2,'voyage':3,'lighthouse':2}
sources={name:synth(name,length) for name,length in durations.items()}
sources.update({n:SOURCE/(n+'.original.mp3') for n in ['click','clue']})
report=[]
for name,src in sources.items():
    cmd=['ffmpeg','-hide_banner','-i',str(src),'-af','volumedetect','-f','null','-']
    log=subprocess.run(cmd,capture_output=True,text=True,check=True).stderr
    peak=float(re.search(r'max_volume: (-?[\d.]+) dB',log).group(1))
    dst=OUTPUT/(name+'.mp3')
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(src),'-af',f'volume={-10-peak:.2f}dB,afade=t=in:d=0.005','-ac','1','-ar',str(RATE),'-c:a','libmp3lame','-b:a','96k',str(dst)],check=True)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-of','json',str(dst)]))
    report.append({'id':name,'file':str(dst.relative_to(ROOT)),'source':str(src.relative_to(ROOT)),'duration':float(probe['format']['duration']),'bytes':dst.stat().st_size,'origin':'ElevenLabs Sound Effects v2' if name in ['click','clue'] else 'Original deterministic DSP synthesis'})
(SOURCE/'audio-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,indent=2))
