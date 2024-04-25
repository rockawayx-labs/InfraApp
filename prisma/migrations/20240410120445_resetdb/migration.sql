-- CreateTable
CREATE TABLE "Ecosystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ecosystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnsibleGroup" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT,
    "ecosystem_id" INTEGER NOT NULL,

    CONSTRAINT "AnsibleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "hostname" TEXT NOT NULL,
    "ansible_group_id" INTEGER,
    "date_created" TIMESTAMP(3) NOT NULL,
    "date_changed" TIMESTAMP(3) NOT NULL,
    "environment_id" INTEGER,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "github" TEXT,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareVersion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "github" TEXT,
    "creator" TEXT,
    "last_editor" TEXT,
    "date_created" TIMESTAMP(3) NOT NULL,
    "last_change" TIMESTAMP(3) NOT NULL,
    "latest_release" TEXT,
    "software_id" INTEGER,
    "approved_version_test_Id" INTEGER,
    "approved_version_main_Id" INTEGER,
    "newest_version_Id" INTEGER,
    "approved" BOOLEAN,

    CONSTRAINT "SoftwareVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" SERIAL NOT NULL,
    "approver" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "environment_id" INTEGER NOT NULL,
    "software_version_id" INTEGER,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnsibleGroupToSoftware" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_serverSoftware" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Ecosystem_name_key" ON "Ecosystem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnsibleGroup_group_name_key" ON "AnsibleGroup"("group_name");

-- CreateIndex
CREATE UNIQUE INDEX "Server_hostname_key" ON "Server"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "Environment_name_key" ON "Environment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SoftwareVersion_approved_version_test_Id_key" ON "SoftwareVersion"("approved_version_test_Id");

-- CreateIndex
CREATE UNIQUE INDEX "SoftwareVersion_approved_version_main_Id_key" ON "SoftwareVersion"("approved_version_main_Id");

-- CreateIndex
CREATE UNIQUE INDEX "SoftwareVersion_newest_version_Id_key" ON "SoftwareVersion"("newest_version_Id");

-- CreateIndex
CREATE UNIQUE INDEX "_AnsibleGroupToSoftware_AB_unique" ON "_AnsibleGroupToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_AnsibleGroupToSoftware_B_index" ON "_AnsibleGroupToSoftware"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_serverSoftware_AB_unique" ON "_serverSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_serverSoftware_B_index" ON "_serverSoftware"("B");

-- AddForeignKey
ALTER TABLE "AnsibleGroup" ADD CONSTRAINT "AnsibleGroup_ecosystem_id_fkey" FOREIGN KEY ("ecosystem_id") REFERENCES "Ecosystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_ansible_group_id_fkey" FOREIGN KEY ("ansible_group_id") REFERENCES "AnsibleGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareVersion" ADD CONSTRAINT "SoftwareVersion_software_id_fkey" FOREIGN KEY ("software_id") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareVersion" ADD CONSTRAINT "SoftwareVersion_approved_version_test_Id_fkey" FOREIGN KEY ("approved_version_test_Id") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareVersion" ADD CONSTRAINT "SoftwareVersion_approved_version_main_Id_fkey" FOREIGN KEY ("approved_version_main_Id") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareVersion" ADD CONSTRAINT "SoftwareVersion_newest_version_Id_fkey" FOREIGN KEY ("newest_version_Id") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "Environment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_software_version_id_fkey" FOREIGN KEY ("software_version_id") REFERENCES "SoftwareVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnsibleGroupToSoftware" ADD CONSTRAINT "_AnsibleGroupToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "AnsibleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnsibleGroupToSoftware" ADD CONSTRAINT "_AnsibleGroupToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_serverSoftware" ADD CONSTRAINT "_serverSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_serverSoftware" ADD CONSTRAINT "_serverSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "SoftwareVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
