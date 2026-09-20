Role	Organisation	Email	Password	Redirects To
Citizen	-	rahul.citizen@example.com	password123	/ (home)
Government Officer	-	officer.patil@maharashtra.gov.in	password123	/government
Admin	-	admin@sih.gov.in	password123	/admin
University Coordinator (Faculty)	ABC Institute of Technology (Pune)	coordinator@abcit.edu.in	password123	/university
Mentor	ABC Institute of Technology (Pune)	dr.sharma@abcit.edu.in	password123	/mentor
Student	ABC Institute of Technology (Pune)	priya.student@abcit.edu.in	password123	/student
University Coordinator (Faculty)	Sahyadri University of Sciences (Pune)	leena.dsouza@sahyadri.edu.in	password123	/university
Mentor	Sahyadri University of Sciences (Pune)	harish.gokhale@sahyadri.edu.in	password123	/mentor
Student	Sahyadri University of Sciences (Pune)	tanvi.sawant@sahyadri.edu.in	password123	/student
University Coordinator (Faculty)	XYZ University of Engineering (Mumbai)	sneha.kapoor@xyzuniv.edu.in	password123	/university
Mentor	XYZ University of Engineering (Mumbai)	prakash.menon@xyzuniv.edu.in	password123	/mentor
Student	XYZ University of Engineering (Mumbai)	ishaan.mehta@xyzuniv.edu.in	password123	/student
Industry Employee	TechSolutions Pvt Ltd (Pune)	amit.engineer@techsolutions.com	password123	/industry
Industry Mentor	TechSolutions Pvt Ltd (Pune)	sunita.mentor@techsolutions.com	password123	/mentor
Industry Expert	TechSolutions Pvt Ltd (Pune)	vivek.sharma@techsolutions.com	password123	/industry
Industry Employee	AquaTech Infra Ltd (Pune)	shweta.pillai@aquatech.co.in	password123	/industry
Industry Mentor	AquaTech Infra Ltd (Pune)	rakesh.menon@aquatech.co.in	password123	/mentor
Industry Expert	AquaTech Infra Ltd (Pune)	dinesh.patwardhan@aquatech.co.in	password123	/industry
Industry Employee	GreenEnergy Corp (Mumbai)	manoj.tiwari@greenenergy.in	password123	/industry
Industry Mentor	GreenEnergy Corp (Mumbai)	suresh.bhat@greenenergy.in	password123	/mentor
Industry Expert	GreenEnergy Corp (Mumbai)	ananya.ghosh@greenenergy.in	password123	/industry

Local demo accounts only. Every one of them uses the same password, so never point this build at anything real.

To reach an organisation dashboard, sign in as the Faculty account for a university or the Employee account
for an industry. Mentor accounts redirect to /mentor, not to the organisation dashboard.

Recreate these with the seed scripts: npm run db:seed and npm run db:seed:people (frontend).
