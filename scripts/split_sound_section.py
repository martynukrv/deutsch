"""Keep authoring numbers and stable IDs; publish the sound foundation separately."""
def split_sound_section(data):
 if data.get('soundFoundation'): return data
 from copy import deepcopy
 data=deepcopy(data)
 foundation=next(l for l in data['lessons'] if l['id']=='sounds-greetings')
 data['soundFoundation']=foundation
 data['lessons']=[l for l in data['lessons'] if l is not foundation]
 for lesson in data['lessons']:
  lesson['authoringNumber']=lesson['number'];lesson['number']-=1
  lesson['prerequisiteIds']=[i for i in lesson['prerequisiteIds'] if i!=foundation['id']]
 for module in data['modules']:
  module['start']=max(1,module['start']-1);module['end']-=1
 data['version']=3
 return data
