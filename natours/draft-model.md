model Tour {
id Int @id @default(autoincrement())
name String @unique
slug String
duration Int
maxGroupSize Int
difficulty String
ratingsAverage Float? @default(4.5)
ratingsQuantity Int?
price Int
priceDiscount Int?
summary String
description String?
imageCover String
images String[]
createdAt DateTime @default(now()) @db.Date
startDates String[]
secretTour Boolean @default(false)
startLocation StartLocation[]
}

model StartLocation {
id Int @id @default(autoincrement())
type String @default("Point")
coordinates String[]
address String
description String
day Int
tour Tour @relation(fields: [tourId], references: [id])
tourId Int  
 }
