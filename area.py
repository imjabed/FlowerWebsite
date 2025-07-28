class BCA:
    def __init__(self, n, m):
        self.name = n
        self.marks = m

        if(self.marks > 50):
            print(self.name, " is Passsed")
        elif (self.marks < 50):
            print(self.name, " is Failed")

jabed = BCA("Abu Jabed", 60);
meher = BCA("Meher Parvin", 30)
