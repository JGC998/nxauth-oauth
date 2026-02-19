-- CreateTable
CREATE TABLE `Grupo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tutor` VARCHAR(191) NOT NULL,
    `aula` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Grupo_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estudiante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `tutor_legal` VARCHAR(191) NOT NULL,
    `grupoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asignatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `profesor` VARCHAR(191) NULL,
    `horas_semana` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AsignaturaToEstudiante` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AsignaturaToEstudiante_AB_unique`(`A`, `B`),
    INDEX `_AsignaturaToEstudiante_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estudiante` ADD CONSTRAINT `Estudiante_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AsignaturaToEstudiante` ADD CONSTRAINT `_AsignaturaToEstudiante_A_fkey` FOREIGN KEY (`A`) REFERENCES `Asignatura`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AsignaturaToEstudiante` ADD CONSTRAINT `_AsignaturaToEstudiante_B_fkey` FOREIGN KEY (`B`) REFERENCES `Estudiante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
