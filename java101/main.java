//-----example1
import java.util.Scanner;

class Main{
  public static void main(String[] args) {

    Scanner inputName = new Scanner(System.in);
    System.out.println("Enter your name:");
    String name = inputName.nextLine();

    Scanner inputAge = new Scanner(System.in);
    System.out.println("Enter your age:");
    int age = inputAge.nextInt();

    Scanner inputSalary = new Scanner(System.in);
    System.out.println("Enter your salary:");
    double salary = inputSalary.nextDouble();

    System.out.println("Your name is " + name);
    System.out.println("Your age is " + age);
    System.out.println("Your salary is " + salary);
  }
}
//-----example2
import java.util.Scanner;

class Main{
  public static void main(String[] args) {

    Scanner input = new Scanner(System.in);
    System.out.println("Enter your name, age, and salary:");

    String name = input.nextLine();
    int age = input.nextInt();
    double salary = input.nextDouble();

    System.out.println("Your name is " + name);
    System.out.println("Your age is " + age);
    System.out.println("Your salary is " + salary);
  }
}
//-----example3
import java.util.Scanner;

class Main{
  public static void main(String[] args) {
    Scanner inputAge = new Scanner(System.in);
    System.out.println("Enter your number:");
    int age = inputAge.nextInt();
    if(age % 2 == 0) System.out.println("It is even");
    else System.out.println("It is odd");
  }
}

//-------define a function
class Main{
  public static void main(String[] args) {
    float[] ar = {1,2,3,9};
    System.out.println(average(ar));
  }

  public static float average(float[] a){
    float sum = 0;

    for (int i = 0; i < a.length; i++) {
        sum += a[i];
    }
    float res = sum / a.length;
    return res;
  }
}

//---------loop through a Stringclass Main{
  public static void main(String[] args) {
    String str = "aaaabbbc";
    char a = 'b';
    System.out.println(countTimes(str, a));
  }

  public static int countTimes(String str, char a){
    int counter = 0;

    for (int i = 0; i < str.length(); i++) {
        if(str.charAt(i) == a) counter++;
    }
    return counter;
  }
}

//----------compare two Stringclass Main{
  public static void main(String[] args) {
    String str = "a";
    System.out.println(isPalindrome("aba"));
  }

  public static boolean isPalindrome(String s){
    String newStr = "";
    for (int i = s.length() - 1; i > -1; i--) {
        newStr += s.charAt(i);
    }

    System.out.println(newStr + s);
    return s.equals(newStr);
  }
}

//----------07/02---------anagram
//if need interact input, should put this code first;
import java.util.Scanner;

public class Solution {

    static boolean isAnagram(String a, String b) {
        // Complete the function
        if(a.length() != b.length()) return false;
        a = a.toLowerCase();
        b = b.toLowerCase();

        int[] a_letters = new int[26];
        int[] b_letters = new int[26];

        for(int i = 0; i < a.length(); i++){
            a_letters[(int)a.charAt(i) - 97]++;
            b_letters[(int)b.charAt(i) - 97]++;
        }

        for(int i = 0; i < a_letters.length; i++){
            if(a_letters[i] != b_letters[i]){
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {

        Scanner scan = new Scanner(System.in);
        String a = scan.next();
        String b = scan.next();
        scan.close();
        boolean ret = isAnagram(a, b);
        System.out.println( (ret) ? "Anagrams" : "Not Anagrams" );
    }
}
