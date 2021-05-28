import statistics

album1 = [50, 100, 90, 95, 42]
album2 = [12, 15, 75, 35]
album3 = [60, 40, 80, 76, 32, 67, 5, 90, 85]

album1median = statistics.median(album1)
album2median = statistics.median(album2)
album3median = statistics.median(album3)

print(album1median)
print(album2median)
print(album3median)
