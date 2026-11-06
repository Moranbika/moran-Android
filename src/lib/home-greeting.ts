export function homeGreetingKey(hour: number): string {
  if (hour >= 5 && hour < 10) return '把今天的学习，留给清晨。';
  if (hour >= 10 && hour < 14) return '趁午前，把今天的学习推进一点。';
  if (hour >= 14 && hour < 18) return '把今天的学习，放进午后。';
  if (hour >= 18 && hour < 23) return '把今天的学习，收进今晚。';
  return '夜深了，学一点也算数。';
}
