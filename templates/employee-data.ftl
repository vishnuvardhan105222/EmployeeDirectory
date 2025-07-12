<#-- Employee Data Template -->
<#assign employees = [
    {
        "id": 1,
        "firstName": "Sarah",
        "lastName": "Johnson",
        "email": "sarah.johnson@company.com",
        "department": "HR",
        "role": "HR Manager",
        "phone": "+1 (555) 123-4567",
        "joinDate": "2020-03-15",
        "avatar": null
    },
    {
        "id": 2,
        "firstName": "Michael",
        "lastName": "Chen",
        "email": "michael.chen@company.com",
        "department": "IT",
        "role": "Senior Developer",
        "phone": "+1 (555) 234-5678",
        "joinDate": "2019-08-22",
        "avatar": null
    },
    {
        "id": 3,
        "firstName": "Emily",
        "lastName": "Rodriguez",
        "email": "emily.rodriguez@company.com",
        "department": "Marketing",
        "role": "Marketing Specialist",
        "phone": "+1 (555) 345-6789",
        "joinDate": "2021-01-10",
        "avatar": null
    },
    {
        "id": 4,
        "firstName": "David",
        "lastName": "Wilson",
        "email": "david.wilson@company.com",
        "department": "Finance",
        "role": "Financial Analyst",
        "phone": "+1 (555) 456-7890",
        "joinDate": "2020-11-05",
        "avatar": null
    },
    {
        "id": 5,
        "firstName": "Jessica",
        "lastName": "Taylor",
        "email": "jessica.taylor@company.com",
        "department": "Operations",
        "role": "Operations Manager",
        "phone": "+1 (555) 567-8901",
        "joinDate": "2018-06-30",
        "avatar": null
    },
    {
        "id": 6,
        "firstName": "Robert",
        "lastName": "Brown",
        "email": "robert.brown@company.com",
        "department": "IT",
        "role": "DevOps Engineer",
        "phone": "+1 (555) 678-9012",
        "joinDate": "2021-09-12",
        "avatar": null
    },
    {
        "id": 7,
        "firstName": "Amanda",
        "lastName": "Davis",
        "email": "amanda.davis@company.com",
        "department": "HR",
        "role": "HR Coordinator",
        "phone": "+1 (555) 789-0123",
        "joinDate": "2022-02-28",
        "avatar": null
    },
    {
        "id": 8,
        "firstName": "Kevin",
        "lastName": "Martinez",
        "email": "kevin.martinez@company.com",
        "department": "Marketing",
        "role": "Digital Marketing Manager",
        "phone": "+1 (555) 890-1234",
        "joinDate": "2020-07-18",
        "avatar": null
    },
    {
        "id": 9,
        "firstName": "Lisa",
        "lastName": "Anderson",
        "email": "lisa.anderson@company.com",
        "department": "Finance",
        "role": "Accounting Manager",
        "phone": "+1 (555) 901-2345",
        "joinDate": "2019-04-03",
        "avatar": null
    },
    {
        "id": 10,
        "firstName": "James",
        "lastName": "Garcia",
        "email": "james.garcia@company.com",
        "department": "Operations",
        "role": "Operations Coordinator",
        "phone": "+1 (555) 012-3456",
        "joinDate": "2021-12-01",
        "avatar": null
    }
]>

<#-- Export for JavaScript -->
<script>
    window.employeeData = {
        employees: [
            <#list employees as employee>
            {
                id: ${employee.id},
                firstName: "${employee.firstName}",
                lastName: "${employee.lastName}",
                email: "${employee.email}",
                department: "${employee.department}",
                role: "${employee.role}",
                phone: "${employee.phone}",
                joinDate: new Date("${employee.joinDate}"),
                avatar: ${employee.avatar!"null"}
            }<#if employee_has_next>,</#if>
            </#list>
        ]
    };
</script>