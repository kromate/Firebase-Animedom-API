public List<Integer> GOODARRAY(int N, List<List<Integer>> queries){
ArrayList<Integer> goodArray = new ArrayList<>();
oneBitCount(goodArray, N);
        
ArrayList<Integer> answer = new ArrayList<>();
long goodArrayProduct = 1;
        
  for(List<Integer> query : queries)
  {
       int l = query.get(0);
       int r = query.get(1);
       int m = query.get(2);
       for(int i=l; i<=r; i++) goodArrayProduct*=goodArray.get(i-1);
       answer.add((int)(goodArrayProduct % m));
   }   
   return answer;   
}
  public void oneBitCount(ArrayList<Integer> goodArray, int n)
  {
        int count = 0;
        while(n > 0)
        {
            if((n & 1) == 1) goodArray.add((int)Math.pow(2,count));
            count++;
            n = n>>1;
        }
   }