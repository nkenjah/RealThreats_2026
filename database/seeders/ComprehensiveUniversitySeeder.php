<?php

namespace Database\Seeders;

use App\Models\AcademicRankHistory;
use App\Models\AcademicTranscript;
use App\Models\AdmissionOffer;
use App\Models\AlumniProfile;
use App\Models\Application;
use App\Models\ApplicationRequirement;
use App\Models\Building;
use App\Models\Campus;
use App\Models\CareerPlacement;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\CourseOffering;
use App\Models\CoursePrerequisite;
use App\Models\DegreeAudit;
use App\Models\Department;
use App\Models\DigitalSubmission;
use App\Models\Disbursement;
use App\Models\Donation;
use App\Models\Dormitory;
use App\Models\Enrollment;
use App\Models\FacultyDepartmentAssignment;
use App\Models\FacultyStaff;
use App\Models\Fee;
use App\Models\FinalTermGrade;
use App\Models\FinancialAccount;
use App\Models\FundSource;
use App\Models\Grade;
use App\Models\GradebookComponent;
use App\Models\GraduationApplication;
use App\Models\Hostel;
use App\Models\HostelAllocation;
use App\Models\InvoiceLineItem;
use App\Models\LibraryBook;
use App\Models\LibraryBorrowing;
use App\Models\LibraryFine;
use App\Models\LmsCourse;
use App\Models\Payment;
use App\Models\Program;
use App\Models\ProgramRequirement;
use App\Models\Prospect;
use App\Models\Room;
use App\Models\RoomInventory;
use App\Models\ScholarshipAward;
use App\Models\SessionLog;
use App\Models\Student;
use App\Models\StudentAssessmentGrade;
use App\Models\StudentRegistration;
use App\Models\StudentStatusLog;
use App\Models\Timetable;
use App\Models\TuitionInvoice;
use App\Models\User;
use App\Models\Waitlist;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComprehensiveUniversitySeeder extends Seeder
{
    public function run(): void
    {
        if (Program::count() > 0) {
            $this->command->warn('Already seeded');

            return;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // ========== PROGRAMS ==========
        $programs = [];
        $programData = [
            ['name' => 'Bachelor of Science in Computer Science', 'code' => 'BSC-CS', 'description' => 'A comprehensive program covering software engineering, algorithms, and computing theory.', 'duration_years' => 3, 'total_credits' => 120],
            ['name' => 'Bachelor of Science in Information Technology', 'code' => 'BSC-IT', 'description' => 'Focus on networking, database management, and IT infrastructure.', 'duration_years' => 3, 'total_credits' => 120],
            ['name' => 'Bachelor of Business Administration', 'code' => 'BBA', 'description' => 'Business management, entrepreneurship, and organizational leadership.', 'duration_years' => 3, 'total_credits' => 90],
            ['name' => 'Bachelor of Education in Science', 'code' => 'BED-SCI', 'description' => 'Training secondary school science teachers with strong pedagogical foundations.', 'duration_years' => 3, 'total_credits' => 90],
        ];
        foreach ($programData as $data) {
            $programs[] = Program::create($data);
        }

        // ========== PROGRAM REQUIREMENTS ==========
        $reqData = [
            ['program_id' => $programs[0]->id, 'name' => 'Core Computer Science Courses', 'type' => 'core', 'credits_required' => 72],
            ['program_id' => $programs[0]->id, 'name' => 'Mathematics Electives', 'type' => 'elective', 'credits_required' => 24],
            ['program_id' => $programs[0]->id, 'name' => 'General Education', 'type' => 'general', 'credits_required' => 24],
            ['program_id' => $programs[1]->id, 'name' => 'Core IT Courses', 'type' => 'core', 'credits_required' => 72],
            ['program_id' => $programs[1]->id, 'name' => 'IT Electives', 'type' => 'elective', 'credits_required' => 24],
            ['program_id' => $programs[1]->id, 'name' => 'General Education', 'type' => 'general', 'credits_required' => 24],
            ['program_id' => $programs[2]->id, 'name' => 'Core Business Courses', 'type' => 'core', 'credits_required' => 54],
            ['program_id' => $programs[2]->id, 'name' => 'Business Electives', 'type' => 'elective', 'credits_required' => 18],
            ['program_id' => $programs[2]->id, 'name' => 'General Education', 'type' => 'general', 'credits_required' => 18],
            ['program_id' => $programs[3]->id, 'name' => 'Core Education Courses', 'type' => 'core', 'credits_required' => 54],
            ['program_id' => $programs[3]->id, 'name' => 'Science Teaching Methods', 'type' => 'elective', 'credits_required' => 18],
            ['program_id' => $programs[3]->id, 'name' => 'General Education', 'type' => 'general', 'credits_required' => 18],
        ];
        foreach ($reqData as $data) {
            ProgramRequirement::create($data);
        }

        // ========== FACULTY STAFF ==========
        $users = User::all();
        $deptCS = Department::where('name', 'ICT')->first() ?? Department::factory()->create(['name' => 'ICT']);
        $deptIT = Department::where('name', 'Finance')->first() ?? Department::factory()->create(['name' => 'Finance']);
        $facultyData = [
            ['user_id' => $users[1]->id ?? 1, 'department_id' => $deptCS->id, 'staff_number' => 'FAC/001', 'job_title' => 'Senior Lecturer', 'contract_type' => 'permanent', 'employment_date' => '2019-08-01'],
            ['user_id' => $users[2]->id ?? 1, 'department_id' => $deptCS->id, 'staff_number' => 'FAC/002', 'job_title' => 'Lecturer', 'contract_type' => 'permanent', 'employment_date' => '2020-01-15'],
            ['user_id' => $users[3]->id ?? 1, 'department_id' => $deptIT->id, 'staff_number' => 'FAC/003', 'job_title' => 'Associate Professor', 'contract_type' => 'permanent', 'employment_date' => '2015-03-20'],
            ['user_id' => $users[4]->id ?? 1, 'department_id' => $deptIT->id, 'staff_number' => 'FAC/004', 'job_title' => 'Assistant Lecturer', 'contract_type' => 'contract', 'employment_date' => '2022-06-01'],
            ['user_id' => $users[5]->id ?? 1, 'department_id' => $deptCS->id, 'staff_number' => 'FAC/005', 'job_title' => 'Professor', 'contract_type' => 'permanent', 'employment_date' => '2010-09-10'],
        ];
        $facultyStaff = [];
        foreach ($facultyData as $data) {
            $facultyStaff[] = FacultyStaff::create($data);
        }

        // ========== ACADEMIC RANK HISTORIES ==========
        $rankData = [
            ['faculty_staff_id' => $facultyStaff[0]->id, 'rank' => 'senior_lecturer', 'effective_date' => '2019-08-01'],
            ['faculty_staff_id' => $facultyStaff[1]->id, 'rank' => 'lecturer', 'effective_date' => '2020-01-15'],
            ['faculty_staff_id' => $facultyStaff[2]->id, 'rank' => 'associate_professor', 'effective_date' => '2020-06-01'],
            ['faculty_staff_id' => $facultyStaff[3]->id, 'rank' => 'assistant_lecturer', 'effective_date' => '2022-06-01'],
            ['faculty_staff_id' => $facultyStaff[4]->id, 'rank' => 'professor', 'effective_date' => '2015-09-10'],
        ];
        foreach ($rankData as $data) {
            AcademicRankHistory::create($data);
        }

        // ========== FACULTY DEPARTMENT ASSIGNMENTS ==========
        $deptCS = Department::where('name', 'ICT')->first() ?? Department::factory()->create(['name' => 'ICT']);
        $deptIT = Department::where('name', 'Finance')->first() ?? Department::factory()->create(['name' => 'Finance']);

        FacultyDepartmentAssignment::create(['faculty_staff_id' => $facultyStaff[0]->id, 'department_id' => $deptCS->id, 'is_primary' => true, 'assigned_at' => now()]);
        FacultyDepartmentAssignment::create(['faculty_staff_id' => $facultyStaff[1]->id, 'department_id' => $deptCS->id, 'is_primary' => true, 'assigned_at' => now()]);
        FacultyDepartmentAssignment::create(['faculty_staff_id' => $facultyStaff[2]->id, 'department_id' => $deptIT->id, 'is_primary' => true, 'assigned_at' => now()]);

        // ========== COURSE OFFERINGS ==========
        $courses = Course::all();
        $offerings = [];
        $offeringData = [
            ['course_id' => $courses[0]->id, 'program_id' => $programs[0]->id, 'academic_year' => '2025/2026', 'semester' => '1', 'section' => 'A', 'max_students' => 60],
            ['course_id' => $courses[0]->id, 'program_id' => $programs[1]->id, 'academic_year' => '2025/2026', 'semester' => '1', 'section' => 'B', 'max_students' => 50],
            ['course_id' => $courses[1]->id, 'program_id' => $programs[0]->id, 'academic_year' => '2025/2026', 'semester' => '1', 'section' => 'A', 'max_students' => 45],
            ['course_id' => $courses[2]->id, 'program_id' => $programs[2]->id, 'academic_year' => '2025/2026', 'semester' => '1', 'section' => 'A', 'max_students' => 70],
        ];
        foreach ($offeringData as $data) {
            $offerings[] = CourseOffering::create($data);
        }

        // ========== COURSE PREREQUISITES ==========
        if (count($courses) >= 2) {
            CoursePrerequisite::create(['course_id' => $courses[1]->id, 'prerequisite_course_id' => $courses[0]->id]);
        }

        // ========== ENROLLMENTS ==========
        $students = Student::all();
        $enrollments = [];
        foreach ($students->take(5) as $i => $student) {
            $offering = $offerings[$i % count($offerings)];
            $enrollments[] = Enrollment::create([
                'student_id' => $student->id,
                'course_offering_id' => $offering->id,
                'enrollment_date' => Carbon::parse('2025-09-01'),
                'status' => 'active',
                'grade' => null,
            ]);
        }

        // ========== STUDENT REGISTRATIONS ==========
        foreach ($students->take(5) as $student) {
            StudentRegistration::create([
                'student_id' => $student->id,
                'academic_year' => '2025/2026',
                'semester' => '1',
                'registration_date' => Carbon::parse('2025-08-15'),
                'status' => 'confirmed',
            ]);
        }

        // ========== STUDENT STATUS LOGS ==========
        StudentStatusLog::create(['student_id' => $students[0]->id, 'previous_status' => null, 'new_status' => 'active', 'reason' => 'New enrollment', 'changed_by' => 'Admin']);
        StudentStatusLog::create(['student_id' => $students[1]->id, 'previous_status' => 'active', 'new_status' => 'probation', 'reason' => 'Low GPA', 'changed_by' => 'Admin']);

        // ========== GRADES ==========
        foreach ($students->take(3) as $i => $student) {
            Grade::create([
                'student_id' => $student->id,
                'course_offering_id' => $offerings[$i]->id,
                'grade' => ['A', 'B+', 'A-'][$i],
                'grade_points' => [4.0, 3.5, 3.7][$i],
                'academic_year' => '2025/2026',
                'semester' => '1',
            ]);
        }

        // ========== GRADEBOOK COMPONENTS ==========
        $components = [];
        $componentData = [
            ['course_offering_id' => $offerings[0]->id, 'name' => 'Midterm Exam', 'type' => 'exam', 'max_score' => 100, 'weight' => 30],
            ['course_offering_id' => $offerings[0]->id, 'name' => 'Final Exam', 'type' => 'exam', 'max_score' => 100, 'weight' => 50],
            ['course_offering_id' => $offerings[0]->id, 'name' => 'Assignments', 'type' => 'assignment', 'max_score' => 100, 'weight' => 20],
            ['course_offering_id' => $offerings[1]->id, 'name' => 'Practical Project', 'type' => 'project', 'max_score' => 100, 'weight' => 40],
            ['course_offering_id' => $offerings[1]->id, 'name' => 'Quizzes', 'type' => 'quiz', 'max_score' => 20, 'weight' => 10],
        ];
        foreach ($componentData as $data) {
            $components[] = GradebookComponent::create($data);
        }

        // ========== FINAL TERM GRADES ==========
        foreach ($enrollments as $i => $enrollment) {
            FinalTermGrade::create([
                'enrollment_id' => $enrollment->id,
                'course_offering_id' => $enrollment->course_offering_id,
                'total_score' => [85, 78, 92, 70, 88][$i],
                'letter_grade' => ['A', 'B+', 'A', 'B', 'A-'][$i],
                'gpa_points' => [4.0, 3.5, 4.0, 3.0, 3.7][$i],
            ]);
        }

        // ========== ACADEMIC TRANSCRIPTS ==========
        foreach ($students->take(3) as $i => $student) {
            AcademicTranscript::create([
                'student_id' => $student->id,
                'program_id' => $programs[$i % count($programs)]->id,
                'total_credits_earned' => [60, 45, 90][$i],
                'cumulative_gpa' => [3.8, 3.2, 3.5][$i],
                'generated_at' => now(),
            ]);
        }

        // ========== PROSPECTS ==========
        $prospects = [];
        $prospectData = [
            ['first_name' => 'Aisha', 'last_name' => 'Mwakasege', 'email' => 'aisha.mwakasege@email.com', 'phone' => '+255712345601', 'high_school' => 'Kibaha Secondary School', 'gpa' => 4.5, 'entry_term' => '2026/2027', 'status' => 'applied'],
            ['first_name' => 'Baraka', 'last_name' => 'Mushi', 'email' => 'baraka.mushi@email.com', 'phone' => '+255712345602', 'high_school' => 'Tabora Boys High School', 'gpa' => 4.2, 'entry_term' => '2026/2027', 'status' => 'contacted'],
            ['first_name' => 'Catherine', 'last_name' => 'Lema', 'email' => 'catherine.lema@email.com', 'phone' => '+255712345603', 'high_school' => 'Loreto High School', 'gpa' => 4.8, 'entry_term' => '2026/2027', 'status' => 'new'],
        ];
        foreach ($prospectData as $data) {
            $prospects[] = Prospect::create($data);
        }

        // ========== APPLICATIONS ==========
        $applications = [];
        $appData = [
            ['prospect_id' => $prospects[0]->id, 'program_id' => $programs[0]->id, 'submission_date' => '2026-03-15', 'status' => 'under_review'],
            ['prospect_id' => $prospects[1]->id, 'program_id' => $programs[1]->id, 'submission_date' => '2026-04-01', 'status' => 'received'],
        ];
        foreach ($appData as $data) {
            $applications[] = Application::create($data);
        }

        // ========== APPLICATION REQUIREMENTS ==========
        ApplicationRequirement::create(['application_id' => $applications[0]->id, 'name' => 'High School Transcript', 'is_met' => true, 'notes' => 'Received']);
        ApplicationRequirement::create(['application_id' => $applications[0]->id, 'name' => 'Recommendation Letter', 'is_met' => false, 'notes' => 'Pending from teacher']);
        ApplicationRequirement::create(['application_id' => $applications[1]->id, 'name' => 'High School Transcript', 'is_met' => true, 'notes' => 'Received']);

        // ========== ADMISSION OFFERS ==========
        AdmissionOffer::create([
            'application_id' => $applications[0]->id,
            'offer_date' => '2026-04-15',
            'decision_deadline' => '2026-05-15',
            'tuition_fee' => 3500000,
            'status' => 'pending',
        ]);

        // ========== FEES ==========
        foreach ($students->take(3) as $i => $student) {
            Fee::create([
                'student_id' => $student->id,
                'fee_type' => 'Tuition Fee',
                'amount' => [2500000, 3000000, 2200000][$i],
                'due_date' => Carbon::parse('2025-09-30'),
                'status' => ['paid', 'pending', 'overdue'][$i],
                'paid_at' => $i === 0 ? Carbon::parse('2025-09-20') : null,
            ]);
        }

        // ========== FINANCIAL ACCOUNTS ==========
        $finAccounts = [];
        foreach ($students->take(3) as $i => $student) {
            $finAccounts[] = FinancialAccount::create([
                'student_id' => $student->id,
                'account_number' => fake()->unique()->regexify('ACC-[0-9]{8}'),
                'current_balance' => [0, 500000, -300000][$i],
                'status' => 'active',
            ]);
        }

        // ========== PAYMENTS ==========
        Payment::create([
            'financial_account_id' => $finAccounts[0]->id,
            'amount' => 2500000,
            'payment_method' => 'Bank Transfer',
            'payment_date' => Carbon::parse('2025-09-20'),
            'reference_number' => 'TXN-001',
            'status' => 'completed',
        ]);

        // ========== TUITION INVOICES ==========
        $invoices = [];
        foreach ($finAccounts as $i => $account) {
            $invoices[] = TuitionInvoice::create([
                'financial_account_id' => $account->id,
                'invoice_number' => fake()->unique()->regexify('INV-[0-9]{6}'),
                'total_amount' => [2500000, 3000000, 2200000][$i],
                'due_date' => Carbon::parse('2025-09-30'),
                'status' => ['paid', 'pending', 'overdue'][$i],
            ]);
        }

        // ========== INVOICE LINE ITEMS ==========
        InvoiceLineItem::create(['tuition_invoice_id' => $invoices[0]->id, 'description' => 'Semester 1 Tuition', 'amount' => 2000000]);
        InvoiceLineItem::create(['tuition_invoice_id' => $invoices[0]->id, 'description' => 'Lab Fees', 'amount' => 300000]);
        InvoiceLineItem::create(['tuition_invoice_id' => $invoices[0]->id, 'description' => 'Library Fees', 'amount' => 200000]);

        // ========== FUND SOURCES ==========
        $funds = [];
        $fundData = [
            ['name' => 'Government Scholarship Fund', 'description' => 'Tanzania government higher education loans', 'total_fund' => 500000000, 'remaining_balance' => 350000000, 'is_active' => true],
            ['name' => 'University Merit Scholarship', 'description' => 'KIUT internal merit-based awards', 'total_fund' => 100000000, 'remaining_balance' => 65000000, 'is_active' => true],
            ['name' => 'Alumni Donation Fund', 'description' => 'Donations from KIUT alumni', 'total_fund' => 50000000, 'remaining_balance' => 50000000, 'is_active' => true],
        ];
        foreach ($fundData as $data) {
            $funds[] = FundSource::create($data);
        }

        // ========== SCHOLARSHIP AWARDS ==========
        ScholarshipAward::create([
            'student_id' => $students[0]->id,
            'fund_source_id' => $funds[0]->id,
            'award_amount' => 2500000,
            'award_date' => '2025-08-15',
            'status' => 'approved',
        ]);
        ScholarshipAward::create([
            'student_id' => $students[1]->id,
            'fund_source_id' => $funds[1]->id,
            'award_amount' => 1500000,
            'award_date' => '2025-08-20',
            'status' => 'disbursed',
        ]);

        // ========== DISBURSEMENTS ==========
        Disbursement::create([
            'scholarship_award_id' => 2,
            'amount' => 1500000,
            'disbursement_date' => '2025-09-01',
            'notes' => 'First semester disbursement',
        ]);

        // ========== LIBRARY BOOKS ==========
        $books = [];
        $bookData = [
            ['isbn' => '978-0131103627', 'title' => 'The C Programming Language', 'author' => 'Brian Kernighan, Dennis Ritchie', 'publisher' => 'Prentice Hall', 'category' => 'Computer Science', 'total_copies' => 10, 'available_copies' => 7, 'shelf_location' => 'CS-A1'],
            ['isbn' => '978-0262033848', 'title' => 'Introduction to Algorithms', 'author' => 'Thomas H. Cormen', 'publisher' => 'MIT Press', 'category' => 'Computer Science', 'total_copies' => 8, 'available_copies' => 5, 'shelf_location' => 'CS-A2'],
            ['isbn' => '978-1118063330', 'title' => 'Principles of Corporate Finance', 'author' => 'Richard Brealey', 'publisher' => 'McGraw-Hill', 'category' => 'Business', 'total_copies' => 6, 'available_copies' => 4, 'shelf_location' => 'BUS-B1'],
        ];
        foreach ($bookData as $data) {
            $books[] = LibraryBook::create($data);
        }

        // ========== LIBRARY BORROWINGS ==========
        $borrowings = [];
        foreach ($students->take(3) as $i => $student) {
            $borrowings[] = LibraryBorrowing::create([
                'library_book_id' => $books[$i]->id,
                'student_id' => $student->id,
                'borrowed_at' => Carbon::parse('2025-10-01')->addDays($i * 5),
                'due_date' => Carbon::parse('2025-10-29')->addDays($i * 5),
                'returned_at' => $i === 0 ? Carbon::parse('2025-10-25') : null,
                'status' => $i === 0 ? 'returned' : 'active',
            ]);
        }

        // ========== LIBRARY FINES ==========
        LibraryFine::create([
            'library_borrowing_id' => $borrowings[1]->id,
            'amount' => 5000,
            'paid' => false,
        ]);

        // ========== LMS COURSES ==========
        $lmsCourses = [];
        foreach ($offerings as $i => $offering) {
            $lmsCourses[] = LmsCourse::create([
                'course_offering_id' => $offering->id,
                'title' => 'Online - '.($courses[$i % count($courses)]->name ?? 'Course'),
                'description' => 'LMS portal for course materials and assignments',
                'status' => 'active',
            ]);
        }

        // ========== COURSE MODULES ==========
        CourseModule::create(['lms_course_id' => $lmsCourses[0]->id, 'title' => 'Introduction', 'description' => 'Course overview and setup', 'order_index' => 1]);
        CourseModule::create(['lms_course_id' => $lmsCourses[0]->id, 'title' => 'Week 1-4: Fundamentals', 'description' => 'Core concepts and principles', 'order_index' => 2]);
        CourseModule::create(['lms_course_id' => $lmsCourses[0]->id, 'title' => 'Week 5-8: Advanced Topics', 'description' => 'Deep dive into advanced material', 'order_index' => 3]);

        // ========== DIGITAL SUBMISSIONS ==========
        DigitalSubmission::create([
            'lms_course_id' => $lmsCourses[0]->id,
            'student_id' => $students[0]->id,
            'file_url' => 'https://lms.kiut.ac.tz/uploads/assignments/submission_001.pdf',
            'submitted_at' => Carbon::parse('2025-10-15'),
            'grade' => 85,
            'feedback' => 'Well done, excellent work!',
        ]);

        // ========== STUDENT ASSESSMENT GRADES ==========
        StudentAssessmentGrade::create([
            'student_id' => $students[0]->id,
            'lms_course_id' => $lmsCourses[0]->id,
            'gradebook_component_id' => $components[0]->id,
            'score' => 88,
        ]);
        StudentAssessmentGrade::create([
            'student_id' => $students[1]->id,
            'lms_course_id' => $lmsCourses[0]->id,
            'gradebook_component_id' => $components[0]->id,
            'score' => 72,
        ]);

        // ========== DORMITORIES ==========
        $dorms = [];
        $dormData = [
            ['name' => 'Nkrumah Hall', 'code' => 'NKH', 'capacity' => 200, 'gender' => 'male', 'description' => 'Main male dormitory near the cafeteria'],
            ['name' => 'Nyerere Hall', 'code' => 'NYH', 'capacity' => 180, 'gender' => 'female', 'description' => 'Female dormitory with study rooms'],
            ['name' => 'Karume Hall', 'code' => 'KRH', 'capacity' => 150, 'gender' => 'mixed', 'description' => 'Mixed-gender dormitory for postgraduate students'],
        ];
        foreach ($dormData as $data) {
            $dorms[] = Dormitory::create($data);
        }

        // ========== HOSTELS ==========
        $hostels = [];
        $hostelData = [
            ['name' => 'Block A', 'dormitory_id' => $dorms[0]->id, 'capacity' => 100],
            ['name' => 'Block B', 'dormitory_id' => $dorms[0]->id, 'capacity' => 100],
            ['name' => 'Block A', 'dormitory_id' => $dorms[1]->id, 'capacity' => 90],
            ['name' => 'Block B', 'dormitory_id' => $dorms[1]->id, 'capacity' => 90],
        ];
        foreach ($hostelData as $data) {
            $hostels[] = Hostel::create($data);
        }

        // ========== HOSTEL ALLOCATIONS ==========
        HostelAllocation::create(['hostel_id' => $hostels[0]->id, 'student_id' => $students[0]->id, 'room_number' => '101', 'allocated_at' => Carbon::parse('2025-08-20'), 'status' => 'active']);
        HostelAllocation::create(['hostel_id' => $hostels[2]->id, 'student_id' => $students[1]->id, 'room_number' => '205', 'allocated_at' => Carbon::parse('2025-08-20'), 'status' => 'active']);

        // ========== CAMPUSES ==========
        $campuses = [];
        $campusData = [
            ['name' => 'Main Campus - Dar es Salaam', 'code' => 'DAR-MAIN', 'address' => '123 Bagamoyo Road', 'city' => 'Dar es Salaam', 'is_active' => true],
            ['name' => 'Kampala International University - Tanzania', 'code' => 'KIUT', 'address' => 'Off Dar es Salaam - Morogoro Road', 'city' => 'Dar es Salaam', 'is_active' => true],
            ['name' => 'Mwanza Campus', 'code' => 'MWZ', 'address' => 'Capri Point', 'city' => 'Mwanza', 'is_active' => true],
        ];
        foreach ($campusData as $data) {
            $campuses[] = Campus::create($data);
        }

        // ========== BUILDINGS ==========
        $buildings = [];
        $buildingData = [
            ['campus_id' => $campuses[1]->id, 'name' => 'ICT Building', 'code' => 'ICT', 'floors' => 4],
            ['campus_id' => $campuses[1]->id, 'name' => 'Business School', 'code' => 'BS', 'floors' => 3],
            ['campus_id' => $campuses[1]->id, 'name' => 'Science Laboratory', 'code' => 'SL', 'floors' => 2],
        ];
        foreach ($buildingData as $data) {
            $buildings[] = Building::create($data);
        }

        // ========== ROOMS ==========
        $rooms = [];
        $roomData = [
            ['building_id' => $buildings[0]->id, 'room_number' => '101', 'room_type' => 'Lecture Hall', 'capacity' => 80, 'is_lab' => false],
            ['building_id' => $buildings[0]->id, 'room_number' => '202', 'room_type' => 'Computer Lab', 'capacity' => 40, 'is_lab' => true],
            ['building_id' => $buildings[0]->id, 'room_number' => '303', 'room_type' => 'Seminar Room', 'capacity' => 30, 'is_lab' => false],
            ['building_id' => $buildings[1]->id, 'room_number' => '001', 'room_type' => 'Lecture Hall', 'capacity' => 100, 'is_lab' => false],
        ];
        foreach ($roomData as $data) {
            $rooms[] = Room::create($data);
        }

        // ========== ROOM INVENTORY ==========
        RoomInventory::create(['room_id' => $rooms[1]->id, 'item_name' => 'Desktop Computer', 'quantity' => 40, 'condition' => 'good']);
        RoomInventory::create(['room_id' => $rooms[1]->id, 'item_name' => 'Projector', 'quantity' => 1, 'condition' => 'good']);
        RoomInventory::create(['room_id' => $rooms[0]->id, 'item_name' => 'Whiteboard Markers', 'quantity' => 20, 'condition' => 'fair']);

        // ========== ALUMNI PROFILES ==========
        foreach ($students->take(2) as $i => $student) {
            AlumniProfile::create([
                'student_id' => $student->id,
                'graduation_year' => [2022, 2023][$i],
                'current_company' => ['NBC Bank', 'Vodacom Tanzania'][$i],
                'job_title' => ['Software Engineer', 'Network Administrator'][$i],
                'industry' => ['Technology', 'Telecommunications'][$i],
                'phone' => '+2557123456'.(80 + $i),
                'address' => 'Dar es Salaam, Tanzania',
                'linkedin_url' => 'https://tz.linkedin.com/in/alumni'.($i + 1),
            ]);
        }

        // ========== CAREER PLACEMENTS ==========
        $alumniProfiles = AlumniProfile::all();
        foreach ($alumniProfiles as $i => $profile) {
            CareerPlacement::create([
                'alumni_profile_id' => $profile->id,
                'company_name' => ['NBC Bank', 'Vodacom Tanzania'][$i],
                'position' => ['Graduate Trainee', 'Junior Network Engineer'][$i],
                'start_date' => Carbon::parse(['2023-01-15', '2024-03-01'][$i]),
                'is_current' => true,
            ]);
        }

        // ========== DONATIONS ==========
        Donation::create([
            'alumni_profile_id' => $alumniProfiles[0]->id,
            'amount' => 500000,
            'donation_date' => '2025-12-01',
            'purpose' => 'ICT Lab Equipment Fund',
        ]);

        // ========== DEGREE AUDITS ==========
        foreach ($students->take(3) as $i => $student) {
            DegreeAudit::create([
                'student_id' => $student->id,
                'program_id' => $programs[$i % count($programs)]->id,
                'total_credits_required' => 120,
                'total_credits_earned' => [60, 30, 90][$i],
                'status' => ['in_progress', 'in_progress', 'completed'][$i],
                'generated_at' => now(),
            ]);
        }

        // ========== GRADUATION APPLICATIONS ==========
        GraduationApplication::create([
            'student_id' => $students[2]->id,
            'application_date' => '2026-03-01',
            'status' => 'pending',
        ]);

        // ========== WAITLISTS ==========
        if (count($students) > 1) {
            Waitlist::create([
                'course_offering_id' => $offerings[0]->id,
                'student_id' => $students[1]->id,
                'position' => 1,
                'status' => 'waiting',
            ]);
        }

        // ========== SESSION LOGS ==========
        $users = User::all();
        foreach ($users->take(3) as $user) {
            SessionLog::create([
                'user_id' => $user->id,
                'ip_address' => '192.168.1.'.random_int(10, 250),
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
                'login_at' => Carbon::parse('2026-06-05 '.random_int(8, 16).':00:00'),
                'logout_at' => Carbon::parse('2026-06-05 '.random_int(16, 18).':00:00'),
                'duration_minutes' => random_int(60, 480),
            ]);
        }

        // ========== TIMETABLES ==========
        foreach ($offerings as $i => $offering) {
            Timetable::create([
                'course_offering_id' => $offering->id,
                'day_of_week' => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][$i % 5],
                'start_time' => '08:00:00',
                'end_time' => '10:00:00',
                'venue' => 'Room '.$rooms[$i % count($rooms)]->room_number,
                'semester' => 1,
                'lecturer_id' => $facultyStaff[$i % count($facultyStaff)]->id,
            ]);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
