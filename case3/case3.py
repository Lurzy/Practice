import random

numbers = []  # Список для хранения сгенерированных чисел

while True:
    # Генерим случайные числа от 1 до 100
    random_number = random.randint(1, 100)
    print(f"\nСгенерировано число: {random_number}")
    numbers.append(random_number)
    
    # Спрашиваем у юзера,  хочет ли он сгенерить еще 1 число, или останавливаем программу, для продолжения надо нажать Enter
    user_input = input("Нажмите Enter для продолжения или введите 0 для остановки: ")
    
    if user_input == "0":
        break
    elif user_input:
        continue

# Вывод всех чисел кроме последнего
if len(numbers) > 1:
    print("\nВсе сгенерированные числа кроме последнего:")
    print(numbers[:-1])  # Выводим все элементы массивакроме последнего
elif len(numbers) == 1:
    print("\nБыло сгенерировано только одно число, нечего выводить.")



